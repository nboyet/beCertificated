import { describe, expect, it } from 'vitest';

import {
  openDownloadedLesson,
  type DownloadedLessonReader,
} from './open-downloaded-lesson.use-case';
import type { Lesson } from '../../domain/learning/entities/lesson';
import type { LessonDownload } from '../../domain/learning/value-objects/lesson-download';

// Synthetic fixtures exercise the contract without selecting real lesson coverage.
const english: Lesson = {
  id: 'acr-lesson',
  locale: 'en',
  content: 'English lesson fixture.',
  version: 'fixture-v1',
  verifiedOn: '2026-11-22',
  sourceLinks: [
    'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200',
  ],
};
const french: Lesson = {
  ...english,
  locale: 'fr',
  content: 'Exemple de leçon en français.',
};

function readerWith(downloads: Record<string, LessonDownload>): DownloadedLessonReader {
  return {
    async read(id, locale) {
      return downloads[`${id}:${locale}`] ?? { status: 'missing' };
    },
  };
}

describe('Open a downloaded lesson', () => {
  it('requires a connection with zero downloads', async () => {
    expect(await openDownloadedLesson('acr-lesson', 'en', readerWith({}))).toEqual({
      status: 'connection-required',
    });
  });

  it('requires a connection when one complete download has another lesson ID', async () => {
    const reader = readerWith({
      'acr-lesson:en': { status: 'complete', lesson: english },
    });

    expect(await openDownloadedLesson('missing-lesson', 'en', reader)).toEqual({
      status: 'connection-required',
    });
  });

  it.each([english, french])(
    'opens the requested complete $locale localization with its identity and provenance offline',
    async (lesson) => {
      const reader = readerWith({
        'acr-lesson:en': { status: 'complete', lesson: english },
        'acr-lesson:fr': { status: 'complete', lesson: french },
      });

      const result = await openDownloadedLesson('acr-lesson', lesson.locale, reader);

      expect(result).toEqual({
        status: 'opened',
        lesson,
      });
    },
  );

  it('indicates a connection is required when the requested download is incomplete', async () => {
    const reader = readerWith({
      'acr-lesson:en': { status: 'complete', lesson: english },
      'acr-lesson:fr': { status: 'incomplete' },
    });

    expect(await openDownloadedLesson('acr-lesson', 'fr', reader)).toEqual({
      status: 'connection-required',
    });
  });
});
