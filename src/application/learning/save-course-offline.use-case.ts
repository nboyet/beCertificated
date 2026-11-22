import type { Lesson, LessonLocale } from '../../domain/learning/entities/lesson';
import { LessonDownloadStatus } from '../../domain/learning/value-objects/lesson-download';
import type { DownloadedLessonReader } from './open-downloaded-lesson.use-case';

export interface CourseAccessReader {
  listUnlockedLessonIds(courseId: string): Promise<readonly string[]>;
}

export interface LessonSource {
  fetch(lessonId: string, locale: LessonLocale): Promise<Lesson | undefined>;
}

export interface DownloadedLessonWriter {
  save(lesson: Lesson): Promise<boolean>;
}

export interface SaveCourseOfflineDependencies {
  readonly access: CourseAccessReader;
  readonly source: LessonSource;
  readonly downloads: DownloadedLessonReader & DownloadedLessonWriter;
}

export type SaveCourseOfflineResult = { readonly status: 'saved' | 'interrupted' };

export async function saveCourseOffline(
  courseId: string,
  locale: LessonLocale,
  dependencies: SaveCourseOfflineDependencies,
): Promise<SaveCourseOfflineResult> {
  const lessonIds = await dependencies.access.listUnlockedLessonIds(courseId);
  for (const lessonId of lessonIds) {
    const download = await dependencies.downloads.read(lessonId, locale);
    if (download.status === LessonDownloadStatus.Complete) continue;

    const lesson = await dependencies.source.fetch(lessonId, locale);
    if (lesson?.id !== lessonId || lesson.locale !== locale) {
      return { status: 'interrupted' };
    }
    if (!await dependencies.downloads.save(lesson)) return { status: 'interrupted' };
  }
  return { status: 'saved' };
}
