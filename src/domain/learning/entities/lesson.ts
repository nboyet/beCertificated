import { z } from 'zod';

export const lessonLocaleSchema = z.enum(['en', 'fr']);
export type LessonLocale = z.infer<typeof lessonLocaleSchema>;

export const lessonSchema = z.object({
  id: z.string(),
  locale: lessonLocaleSchema,
  content: z.string(),
  version: z.string(),
  verifiedOn: z.string(),
  sourceLinks: z.array(z.string()).readonly(),
}).readonly();

export type Lesson = z.infer<typeof lessonSchema>;
