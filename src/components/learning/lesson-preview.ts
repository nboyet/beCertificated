import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CourseAccessReader, LessonSource, DownloadedLessonWriter } from '@/application/learning/save-course-offline.use-case';
import { lessonSchema } from '@/domain/learning/entities/lesson';
import type { DownloadedLessonReader } from '@/application/learning/open-downloaded-lesson.use-case';
import type { Lesson, LessonLocale } from '@/domain/learning/entities/lesson';
import { LessonDownloadStatus } from '@/domain/learning/value-objects/lesson-download';

export const previewLessonId = 'preview-acr-introduction';
const content: Record<string, Record<LessonLocale, string>> = {
  [previewLessonId]: {
    en: 'This is a synthetic lesson preview. A container registry stores container images. Images package an application and its dependencies. A tag gives an image a readable label. This sample demonstrates bilingual offline reading; it is not the agreed AI-200 teaching content.',
    fr: 'Ceci est un aperçu de leçon fictif. Un registre de conteneurs stocke des images de conteneurs. Une image regroupe une application et ses dépendances. Une étiquette donne un nom lisible à une image. Cet exemple illustre la lecture bilingue hors ligne ; ce n’est pas le contenu pédagogique AI-200 convenu.',
  },
  'preview-image-tags': {
    en: 'Synthetic sample: a tag is a readable label for a container image. Tags can help identify a version. This is sample content, not an agreed AI-200 teaching lesson.',
    fr: 'Exemple fictif : une étiquette est un nom lisible pour une image de conteneur. Elle peut aider à identifier une version. Ce texte n’est pas une leçon AI-200 validée.',
  },
};
const officialSource = 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200';
export const previewCourseId = 'sample-ai-200';
export const previewLessons = [
  { id: previewLessonId, title: 'Meet your container registry' },
  { id: 'preview-image-tags', title: 'Give your images a name' },
  { id: 'preview-build', title: 'Build an image' },
  { id: 'preview-push', title: 'Push to a registry' },
  { id: 'preview-pull', title: 'Pull an image' },
  { id: 'preview-access', title: 'Registry access' },
  { id: 'preview-tasks', title: 'Registry tasks' },
  { id: 'preview-review', title: 'Review your registry' },
] as const;
export const unlockedIds: readonly string[] = previewLessons.slice(0, 2).map(lesson => lesson.id);
export const previewAccess: CourseAccessReader = {
  async listUnlockedLessonIds(courseId) {
    return courseId === previewCourseId ? unlockedIds : [];
  },
};
export const previewSource: LessonSource = {
  async fetch(id, locale) {
    if (!unlockedIds.includes(id)) return undefined;
    return {
      id,
      locale,
      content: content[id][locale],
      version: 'preview-1',
      verifiedOn: '2026-11-22',
      sourceLinks: [officialSource],
    };
  },
};
const storagePrefix = '@beCertified/sample-download/v1/';
const storageKey = (id: string, locale: LessonLocale) => `${storagePrefix}${encodeURIComponent(id)}/${locale}`;
export const previewDownloads: DownloadedLessonReader & DownloadedLessonWriter = {
  async read(id, locale) {
    const raw = await AsyncStorage.getItem(storageKey(id, locale));
    if (raw === null) return { status: LessonDownloadStatus.Missing };
    try {
      const parsed = lessonSchema.safeParse(JSON.parse(raw));
      if (
        parsed.success &&
        parsed.data.id === id &&
        parsed.data.locale === locale &&
        parsed.data.sourceLinks.length === 1 &&
        parsed.data.sourceLinks[0] === officialSource
      ) {
        return { status: LessonDownloadStatus.Complete, lesson: parsed.data };
      }
    } catch {
      // Invalid stored sample content is unavailable.
    }
    return { status: LessonDownloadStatus.Incomplete };
  },
  async save(lesson) {
    try {
      const parsed = lessonSchema.safeParse(lesson);
      if (!parsed.success || !unlockedIds.includes(lesson.id)) return false;
      await AsyncStorage.setItem(storageKey(lesson.id, lesson.locale), JSON.stringify(parsed.data));
      return true;
    } catch {
      return false;
    }
  },
};
export async function listPreviewDownloads(): Promise<readonly Lesson[]> {
  const lessons: Lesson[] = [];
  for (const id of unlockedIds) {
    for (const locale of ['en', 'fr'] as const) {
      const download = await previewDownloads.read(id, locale);
      if (download.status === LessonDownloadStatus.Complete) lessons.push(download.lesson);
    }
  }
  return lessons;
}
