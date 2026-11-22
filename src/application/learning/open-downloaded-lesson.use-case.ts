import type { Lesson, LessonLocale } from '../../domain/learning/entities/lesson';
import {
  LessonDownloadStatus,
  type LessonDownload,
} from '../../domain/learning/value-objects/lesson-download';

export interface DownloadedLessonReader {
  read(lessonId: string, locale: LessonLocale): Promise<LessonDownload>;
}

export type OpenDownloadedLessonResult =
  | { readonly status: 'opened'; readonly lesson: Lesson }
  | { readonly status: 'connection-required' };

const outcomeByStatus = {
  [LessonDownloadStatus.Complete]: 'opened',
  [LessonDownloadStatus.Incomplete]: 'connection-required',
  [LessonDownloadStatus.Missing]: 'connection-required',
} as const satisfies Record<LessonDownload['status'], OpenDownloadedLessonResult['status']>;

export async function openDownloadedLesson(
  lessonId: string,
  locale: LessonLocale,
  reader: DownloadedLessonReader,
): Promise<OpenDownloadedLessonResult> {
  const download = await reader.read(lessonId, locale);
  if (download.status === LessonDownloadStatus.Complete) {
    return { status: outcomeByStatus[download.status], lesson: download.lesson };
  }
  return { status: outcomeByStatus[download.status] };
}
