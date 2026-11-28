import { beforeEach, expect, jest, test } from '@jest/globals';
import { cleanup, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';
import Lessons from '../src/app/index';
import Downloads from '../src/app/explore';

const mockRecords = new Map<string, string>();
let mockOnline = false;
let mockInvalidContent = false;
let mockWriteFails = false;

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: async (key: string) => mockRecords.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      if (mockWriteFails) throw new Error('Storage interrupted');
      mockRecords.set(key, value);
    },
  },
}));

beforeEach(() => {
  mockRecords.clear();
  mockOnline = false;
  mockInvalidContent = false;
  mockWriteFails = false;
  process.env.EXPO_PUBLIC_CONTENT_ORIGIN = "https://content.becertified.test";
  globalThis.fetch = async (url) => {
    if (url !== "https://content.becertified.test/courses/ai-200.fr.json") throw new Error("Unknown content URL");
    if (!mockOnline) throw new Error('Offline');
    return new Response(JSON.stringify(mockInvalidContent ? { lessons: [] } : require('../public/courses/ai-200.fr.json')));
  };
});

async function openRoute(path = '/') {
  await renderRouter({ index: Lessons, explore: Downloads }, { initialUrl: path });
  await waitFor(() => expect(screen.queryByText('Chargement des leçons enregistrées…')).toBeNull());
}

async function press(name: string) {
  await fireEvent.press(screen.getByRole('button', { name }));
}

const unsaved = 'Images et étiquettes dans Azure Container Registry, FR, non téléchargée';
const saved = 'Images et étiquettes dans Azure Container Registry, FR, disponible hors ligne';
const save = 'Télécharger le cours en français';

test('première ouverture hors ligne demande une connexion en français sans verrou ni connexion au compte', async () => {
  await openRoute();
  expect(screen.queryAllByRole('button', { disabled: true })).toHaveLength(0);
  await press(unsaved);
  expect(await screen.findByText('CONNEXION NÉCESSAIRE')).toBeTruthy();
  expect(screen.getByText('Connectez-vous à Internet puis téléchargez le cours depuis Leçons pour lire cette leçon hors ligne.')).toBeTruthy();
});

test('téléchargement explicite puis redémarrage hors ligne conserve contenu français et sources accessibles', async () => {
  mockOnline = true;
  await openRoute();
  await press(save);
  await screen.findByRole('button', { name: 'Cours disponible hors ligne. Télécharger le cours en français' });
  await cleanup();
  mockOnline = false;
  await openRoute('/explore');
  await press(saved);
  expect(await screen.findByText(/Une image de conteneur regroupe/)).toBeTruthy();
  expect(screen.getByText('Identifiant : acr-images-tags')).toBeTruthy();
  expect(screen.getByText('Version 1 · Vérifié le 2026-11-28')).toBeTruthy();
  expect(screen.getAllByRole('link', { name: /Source Microsoft/ })).toHaveLength(2);
});

test.each(['réseau', 'contenu', 'stockage'])('échec %s permet de réessayer sans faux succès', async (failure) => {
  mockOnline = failure !== 'réseau';
  mockInvalidContent = failure === 'contenu';
  mockWriteFails = failure === 'stockage';
  await openRoute();
  await press(save);
  expect(await screen.findByText('Téléchargement interrompu. Les leçons enregistrées sont conservées. Réessayez pour terminer.')).toBeTruthy();
  expect(screen.queryByRole('button', { name: /^Cours disponible/ })).toBeNull();
  await press(unsaved);
  expect(await screen.findByText('CONNEXION NÉCESSAIRE')).toBeTruthy();
  await press('Fermer la leçon');
  mockOnline = true;
  mockInvalidContent = false;
  mockWriteFails = false;
  await press(save);
  await screen.findByRole('button', { name: 'Cours disponible hors ligne. Télécharger le cours en français' });
});
