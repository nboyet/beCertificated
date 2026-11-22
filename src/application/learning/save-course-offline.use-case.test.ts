import { describe, expect, it } from 'vitest';

import type { Lesson, LessonLocale } from '../../domain/learning/entities/lesson';
import type { LessonDownload } from '../../domain/learning/value-objects/lesson-download';
import { openDownloadedLesson } from './open-downloaded-lesson.use-case';
import { saveCourseOffline, type SaveCourseOfflineDependencies } from './save-course-offline.use-case';

// Synthetic fixtures do not establish real course coverage or entitlement rules.
const ids = Array.from({ length: 8 }, (_, index) => `lesson-${index + 1}`);
const locales = ['en', 'fr'] as const;
const lessons: readonly Lesson[] = ids.flatMap((id) => locales.map((locale) => ({
  id,
  locale,
  content: locale === 'en' ? `English fixture ${id}.` : `Exemple français ${id}.`,
  version: 'fixture-v1',
  verifiedOn: '2026-11-22',
  sourceLinks: ['https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200'],
})));
const key = (id: string, locale: LessonLocale) => `${id}:${locale}`;
const lessonFor = (id: string, locale: LessonLocale) => lessons.find((lesson) => lesson.id === id && lesson.locale === locale)!;

function fixture() {
  const available = new Map(lessons.map((lesson) => [key(lesson.id, lesson.locale), lesson]));
  const saved = new Map<string, LessonDownload>();
  const dependencies: SaveCourseOfflineDependencies = {
    access: {
      async listUnlockedLessonIds(courseId) {
        return courseId === 'course' ? ids.slice(0, 2) : [];
      },
    },
    source: {
      async fetch(id, locale) {
        return available.get(key(id, locale));
      },
    },
    downloads: {
      async read(id, locale) {
        return saved.get(key(id, locale)) ?? { status: 'missing' };
      },
      async save(lesson) {
        saved.set(key(lesson.id, lesson.locale), { status: 'complete', lesson });
        return true;
      },
    },
  };
  return { available, dependencies };
}

describe('Save a course offline', () => {
  it.each(locales)('saves only the unlocked first quarter of eight lessons in %s', async (locale) => {
    const { dependencies } = fixture();

    expect(await saveCourseOffline('course', locale, dependencies)).toEqual({ status: 'saved' });

    for (const id of ids) {
      for (const requestedLocale of locales) {
        expect(await openDownloadedLesson(id, requestedLocale, dependencies.downloads)).toEqual(
          ids.slice(0, 2).includes(id) && requestedLocale === locale
            ? { status: 'opened', lesson: lessonFor(id, locale) }
            : { status: 'connection-required' },
        );
      }
    }
  });

  it.each(locales)('keeps the first completed %s lesson openable after interruption', async (locale) => {
    const { available, dependencies } = fixture();
    available.delete(key(ids[1], locale));

    expect(await saveCourseOffline('course', locale, dependencies)).toEqual({ status: 'interrupted' });
    expect(await openDownloadedLesson(ids[0], locale, dependencies.downloads)).toEqual({
      status: 'opened', lesson: lessonFor(ids[0], locale),
    });
    expect(await openDownloadedLesson(ids[1], locale, dependencies.downloads)).toEqual({ status: 'connection-required' });
  });

  it.each(locales)('retries remaining %s lessons when the completed lesson is no longer at the source', async (locale) => {
    const { available, dependencies } = fixture();
    available.delete(key(ids[1], locale));
    expect(await saveCourseOffline('course', locale, dependencies)).toEqual({ status: 'interrupted' });

    available.delete(key(ids[0], locale));
    available.set(key(ids[1], locale), lessonFor(ids[1], locale));
    expect(await saveCourseOffline('course', locale, dependencies)).toEqual({ status: 'saved' });
    for (const id of ids.slice(0, 2)) {
      expect(await openDownloadedLesson(id, locale, dependencies.downloads)).toEqual({
        status: 'opened', lesson: lessonFor(id, locale),
      });
    }
  });
});
