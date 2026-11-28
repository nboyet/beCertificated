import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { saveCourseOffline } from "@/application/learning/save-course-offline.use-case";
import { Linking } from "react-native";
import {
  openDownloadedLesson,
  type OpenDownloadedLessonResult,
} from "@/application/learning/open-downloaded-lesson.use-case";
import type { Lesson, LessonLocale } from "@/domain/learning/entities/lesson";
import {
  listPreviewDownloads,
  previewAccess,
  previewCourseId,
  previewDownloads,
  previewLessons,
  previewSource,
  unlockedIds,
} from "./lesson-preview";

export function useLearningScreen(downloads: boolean) {
  const locale: LessonLocale = "fr";
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [result, setResult] = useState<OpenDownloadedLessonResult | null>(null);
  const [saved, setSaved] = useState<readonly Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const refreshVersion = useRef(0);
  const openVersion = useRef(0);
  const savePending = useRef(false);
  const refresh = useCallback(async () => {
    const version = ++refreshVersion.current;
    setLoading(true);
    try {
      const lessons = await listPreviewDownloads();
      if (version === refreshVersion.current) {
        setSaved(lessons);
        setStorageError(null);
      }
    } catch {
      if (version === refreshVersion.current) {
        setSaved([]);
        setStorageError("Impossible de lire les leçons enregistrées. Réessayez.");
      }
    } finally {
      if (version === refreshVersion.current) setLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      void refresh();
      return () => {
        refreshVersion.current++;
        openVersion.current++;
      };
    }, [refresh]),
  );
  async function open(id: string, language = locale) {
    const version = ++openVersion.current;
    setSourceError(null);
    try {
      const opened = await openDownloadedLesson(id, language, previewDownloads);
      if (version === openVersion.current) setResult(opened);
    } catch {
      if (version === openVersion.current)
        setStorageError("Impossible de lire cette leçon. Réessayez.");
    }
  }
  async function save() {
    if (savePending.current) return;
    savePending.current = true;
    setSaving(true);
    setStorageError(null);
    try {
      const outcome = await saveCourseOffline(previewCourseId, locale, {
        access: previewAccess,
        source: previewSource,
        downloads: previewDownloads,
      });
      await refresh();
      if (outcome.status === "interrupted") {
        setStorageError(
          "Téléchargement interrompu. Les leçons enregistrées sont conservées. Réessayez pour terminer.",
        );
      }
    } catch {
      await refresh();
      setStorageError(
        "Téléchargement interrompu. Les leçons enregistrées sont conservées. Réessayez pour terminer.",
      );
    } finally {
      savePending.current = false;
      setSaving(false);
    }
  }
  const courseSaved =
    !loading &&
    !storageError &&
    unlockedIds.every((id) =>
      saved.some((item) => item.id === id && item.locale === locale),
    );

  function closeReader() {
    openVersion.current++;
    setResult(null);
  }

  const rows = downloads
    ? saved.flatMap((lesson) => {
        const preview = previewLessons.find((item) => item.id === lesson.id);
        return preview ? [{ ...preview, locale: lesson.locale }] : [];
      })
    : previewLessons.map((lesson) => ({ ...lesson, locale }));
  const lessonRows = rows.map((lesson) => ({
    ...lesson,
    locked: !downloads && !unlockedIds.includes(lesson.id),
    downloaded: saved.some(
      (item) => item.id === lesson.id && item.locale === lesson.locale,
    ),
  }));

  async function openSource(link: string) {
    setSourceError(null);
    try {
      await Linking.openURL(link);
    } catch {
      setSourceError(
        "Impossible d’ouvrir la source. Vérifiez votre connexion puis réessayez.",
      );
    }
  }
  return {
    locale,
    sourceError,
    result,
    saved,
    loading,
    saving,
    storageError,
    refresh,
    open,
    save,
    courseSaved,
    closeReader,
    rows: lessonRows,
    openSource,
  };
}
