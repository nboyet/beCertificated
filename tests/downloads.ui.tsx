import { beforeEach, expect, jest, test } from '@jest/globals';
import { cleanup, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';
import Lessons from '../src/app/index';
import Downloads from '../src/app/explore';

const mockRecords = new Map<string, string>();
let mockInterruptSecondEnglishWrite = false;

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: async (key: string) => mockRecords.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      if (mockInterruptSecondEnglishWrite && key.endsWith('/preview-image-tags/en')) {
        mockInterruptSecondEnglishWrite = false;
        throw new Error('Storage interrupted');
      }
      mockRecords.set(key, value);
    },
  },
}));

beforeEach(() => {
  mockRecords.clear();
  mockInterruptSecondEnglishWrite = false;
});

async function openRoute(path = '/') {
  await renderRouter({ index: Lessons, explore: Downloads }, { initialUrl: path });
  await waitFor(() => expect(screen.queryByText('Loading saved samples…')).toBeNull());
}

async function press(name: string) {
  await fireEvent.press(screen.getByRole('button', { name }));
}

async function save(language: 'English' | 'French') {
  await press(`Save all unlocked sample lessons in ${language}`);
  await screen.findByRole('button', { name: `Saved offline. Save all unlocked sample lessons in ${language}` });
}

async function closeReader() {
  await press('Close lesson preview');
}

test('empty Downloads and unsaved unlocked lessons require saving while six locked lessons stay disabled', async () => {
  await openRoute('/explore');
  expect(screen.getByText('0 saved localizations · English + français')).toBeTruthy();
  expect(screen.getByText('No samples saved yet. Save the unlocked samples from Lessons, then read them here offline.')).toBeTruthy();
  await cleanup();
  await openRoute();
  expect(screen.getAllByRole('button', { name: /locked sample$/, disabled: true })).toHaveLength(6);
  await press('Meet your container registry, EN, not saved');
  expect(await screen.findByText('CONNECTION REQUIRED')).toBeTruthy();
  expect(screen.getByText('This lesson is not downloaded in the requested language. Save the unlocked sample course in this language from Lessons first.')).toBeTruthy();
});

test('English and French saves stay independent and persist four localizations with bilingual provenance', async () => {
  await openRoute();
  await save('English');
  await press('Lire en français');
  expect(screen.queryByRole('button', { name: /^Saved offline\./ })).toBeNull();
  await press('Meet your container registry, FR, not saved');
  expect(await screen.findByText('CONNECTION REQUIRED')).toBeTruthy();
  await closeReader();
  await save('French');
  await cleanup();
  await openRoute('/explore');
  expect(screen.getByText('4 saved localizations · English + français')).toBeTruthy();
  expect(screen.getAllByRole('button', { name: /, (EN|FR), saved offline$/ })).toHaveLength(4);
  for (const [locale, body] of [
    ['EN', 'This is a synthetic lesson preview. A container registry stores container images. Images package an application and its dependencies. A tag gives an image a readable label. This sample demonstrates bilingual offline reading; it is not the agreed AI-200 teaching content.'],
    ['FR', 'Ceci est un aperçu de leçon fictif. Un registre de conteneurs stocke des images de conteneurs. Une image regroupe une application et ses dépendances. Une étiquette donne un nom lisible à une image. Cet exemple illustre la lecture bilingue hors ligne ; ce n’est pas le contenu pédagogique AI-200 convenu.'],
  ]) {
    await press(`Meet your container registry, ${locale}, saved offline`);
    expect(await screen.findByText(body)).toBeTruthy();
    expect(screen.getByText('Lesson ID: preview-acr-introduction')).toBeTruthy();
    expect(screen.getByText('Version preview-1 · Sample verification date 2026-11-22')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Open official Microsoft AI-200 study guide' })).toBeTruthy();
    await closeReader();
  }
});

test('interrupted second English write retains first lesson and retry completes course', async () => {
  mockInterruptSecondEnglishWrite = true;
  await openRoute();
  await press('Save all unlocked sample lessons in English');
  expect(await screen.findByText('Saving stopped. Completed samples are retained. Retry to save the remaining samples.')).toBeTruthy();
  expect(screen.queryByRole('button', { name: /^Saved offline\./ })).toBeNull();
  await press('Meet your container registry, EN, saved offline');
  expect(await screen.findByText('Lesson ID: preview-acr-introduction')).toBeTruthy();
  await closeReader();
  await press('Give your images a name, EN, not saved');
  expect(await screen.findByText('CONNECTION REQUIRED')).toBeTruthy();
  await closeReader();
  await save('English');
  await press('Give your images a name, EN, saved offline');
  expect(await screen.findByText('Lesson ID: preview-image-tags')).toBeTruthy();
  await closeReader();
  await press('Meet your container registry, EN, saved offline');
  expect(await screen.findByText('Lesson ID: preview-acr-introduction')).toBeTruthy();
});
