import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CourseAccessReader, LessonSource, DownloadedLessonWriter } from '@/application/learning/save-course-offline.use-case';
import { lessonSchema } from '@/domain/learning/entities/lesson';
import type { DownloadedLessonReader } from '@/application/learning/open-downloaded-lesson.use-case';
import type { Lesson, LessonLocale } from '@/domain/learning/entities/lesson';
import { LessonDownloadStatus } from '@/domain/learning/value-objects/lesson-download';

export const previewLessonId = 'acr-images-tags';
export const previewCourseId = 'ai-200';
export const previewLessons = [
  { id: previewLessonId, title: 'Images et étiquettes dans Azure Container Registry' },
] as const;
export const unlockedIds: readonly string[] = previewLessons.map(lesson => lesson.id);
export const previewAccess: CourseAccessReader = {
  async listUnlockedLessonIds(courseId) {
    return courseId === previewCourseId ? unlockedIds : [];
  },
};
function validLesson(value: unknown): Lesson | undefined {
  const parsed = lessonSchema.safeParse(value);
  if (!parsed.success) return undefined;
  const lesson = parsed.data;
  return unlockedIds.includes(lesson.id) && lesson.locale === 'fr' &&
    lesson.content.trim().length > 0 && lesson.content.trim().split(/\s+/u).length < 250 &&
    lesson.version.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(lesson.verifiedOn) &&
    lesson.sourceLinks.length > 0 && lesson.sourceLinks.every(link => {
      try {
        const url = new URL(link);
        return url.protocol === 'https:' && url.hostname === 'learn.microsoft.com' && !url.username && !url.password;
      } catch {
        return false;
      }
    })
    ? lesson : undefined;
}
export const previewSource: LessonSource = {
  async fetch(id, locale) {
    if (!unlockedIds.includes(id) || locale !== 'fr') return undefined;
    const configured = process.env.EXPO_PUBLIC_CONTENT_ORIGIN;
    const host = Constants.expoConfig?.hostUri;
    const origin = configured ?? (Platform.OS === 'web' ? window.location.origin : __DEV__ && host ? `http://${host}` : undefined);
    if (!origin) return undefined;
    try {
      if (configured && new URL(configured).protocol !== 'https:') return undefined;
      const response = await fetch(new URL('/courses/ai-200.fr.json', origin).href);
      if (!response.ok) return undefined;
      const payload: unknown = await response.json();
      if (!payload || typeof payload !== 'object' || !('lessons' in payload) || !Array.isArray(payload.lessons)) return undefined;
      const lessons = payload.lessons.map(validLesson);
      if (lessons.length !== unlockedIds.length || lessons.some(lesson => !lesson)) return undefined;
      return lessons.find(lesson => lesson?.id === id && lesson.locale === locale);
    } catch {
      return undefined;
    }
  },
};
const storagePrefix = '@beCertified/course-download/v1/';
const storageKey = (id: string, locale: LessonLocale) => `${storagePrefix}${encodeURIComponent(id)}/${locale}`;
export const previewDownloads: DownloadedLessonReader & DownloadedLessonWriter = {
  async read(id, locale) {
    const raw = await AsyncStorage.getItem(storageKey(id, locale));
    if (raw === null) return { status: LessonDownloadStatus.Missing };
    try {
      const lesson = validLesson(JSON.parse(raw));
      if (lesson && lesson.id === id && lesson.locale === locale) {
        return { status: LessonDownloadStatus.Complete, lesson };
      }
    } catch {
      // Invalid stored content is unavailable.
    }
    return { status: LessonDownloadStatus.Incomplete };
  },
  async save(lesson) {
    try {
      const parsed = validLesson(lesson);
      if (!parsed) return false;
      await AsyncStorage.setItem(storageKey(lesson.id, lesson.locale), JSON.stringify(parsed));
      return true;
    } catch {
      return false;
    }
  },
};
export async function listPreviewDownloads(): Promise<readonly Lesson[]> {
  const lessons: Lesson[] = [];
  for (const id of unlockedIds) {
    const download = await previewDownloads.read(id, 'fr');
    if (download.status === LessonDownloadStatus.Complete) lessons.push(download.lesson);
  }
  return lessons;
}
