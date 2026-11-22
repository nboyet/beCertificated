import { z } from 'zod';

import { lessonSchema } from '../entities/lesson';

export const lessonDownloadStatusSchema = z.enum({
  Complete: 'complete',
  Incomplete: 'incomplete',
  Missing: 'missing',
});

export const LessonDownloadStatus = lessonDownloadStatusSchema.enum;

export const lessonDownloadSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal(LessonDownloadStatus.Complete), lesson: lessonSchema }).readonly(),
  z.object({ status: z.literal(LessonDownloadStatus.Incomplete) }).readonly(),
  z.object({ status: z.literal(LessonDownloadStatus.Missing) }).readonly(),
]);

export type LessonDownload = z.infer<typeof lessonDownloadSchema>;
