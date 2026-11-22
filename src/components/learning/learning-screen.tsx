import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { saveCourseOffline } from '@/application/learning/save-course-offline.use-case';
import { Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openDownloadedLesson, type OpenDownloadedLessonResult } from '@/application/learning/open-downloaded-lesson.use-case';
import type { Lesson, LessonLocale } from '@/domain/learning/entities/lesson';
import { listPreviewDownloads, previewAccess, previewCourseId, previewDownloads, previewLessons, previewSource, unlockedIds } from './lesson-preview';

export function LearningScreen({ downloads = false }: { downloads?: boolean }) {
  const { width } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const compact = (Platform.OS !== 'web' || mounted) && width <= 740;
  const [locale, setLocale] = useState<LessonLocale>('en');
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [result, setResult] = useState<OpenDownloadedLessonResult | null>(null);
  const [saved, setSaved] = useState<readonly Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const refreshVersion = useRef(0);
  const openVersion = useRef(0);
  const savePending = useRef(false);
  const refresh = useCallback(async () => {
    const version = ++refreshVersion.current;
    setLoading(true);
    try {
      const lessons = await listPreviewDownloads();
      if (version === refreshVersion.current) {
        setSaved(lessons);
        setStorageError(null);
      }
    } catch {
      if (version === refreshVersion.current) {
        setSaved([]);
        setStorageError('Unable to read saved samples. Try again.');
      }
    } finally {
      if (version === refreshVersion.current) setLoading(false);
    }
  }, []);
  useFocusEffect(useCallback(() => {
    void refresh();
    return () => {
      refreshVersion.current++;
      openVersion.current++;
    };
  }, [refresh]));
  async function open(id: string, language = locale) {
    const version = ++openVersion.current;
    setSourceError(null);
    try {
      const opened = await openDownloadedLesson(id, language, previewDownloads);
      if (version === openVersion.current) setResult(opened);
    } catch {
      if (version === openVersion.current) setStorageError('Unable to read this saved sample. Try again.');
    }
  }
  function selectLanguage(language: LessonLocale) {
    setLocale(language);
    openVersion.current++;
    setResult(null);
  }
  async function save() {
    if (savePending.current) return;
    savePending.current = true;
    setSaving(true);
    setStorageError(null);
    try {
      const outcome = await saveCourseOffline(previewCourseId, locale, {
        access: previewAccess,
        source: previewSource,
        downloads: previewDownloads,
      });
      await refresh();
      if (outcome.status === 'interrupted') {
        setStorageError('Saving stopped. Completed samples are retained. Retry to save the remaining samples.');
      }
    } catch {
      await refresh();
      setStorageError('Saving stopped. Completed samples are retained. Retry to save the remaining samples.');
    } finally {
      savePending.current = false;
      setSaving(false);
    }
  }
  const courseSaved = !loading && !storageError && unlockedIds.every(id =>
    saved.some(item => item.id === id && item.locale === locale)
  );

  function closeReader() {
    openVersion.current++;
    setResult(null);
  }

  const rows = downloads
    ? saved.flatMap(lesson => {
        const preview = previewLessons.find(item => item.id === lesson.id);
        return preview ? [{ ...preview, locale: lesson.locale }] : [];
      })
    : previewLessons.map(lesson => ({ ...lesson, locale }));

  async function openSource(link: string) {
    setSourceError(null);
    try {
      await Linking.openURL(link);
    } catch {
      setSourceError('Unable to open the study guide. Check your connection and try again.');
    }
  }
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.page, compact && styles.compactPage]}>
          <View style={[styles.topline, compact && { marginBottom: 20 }]}>
            <Text style={styles.wordmark}>be<Text style={{ color: '#087D74' }}>Certified</Text>
              <Text style={{ color: '#EE764F' }}>.</Text>
            </Text>
            <View style={styles.preview}>
              <Text style={styles.eyebrow}>DESIGN PREVIEW</Text>
            </View>
          </View>
          <View style={[styles.headingRow, compact && { marginBottom: 20 }]}>
            <View style={styles.heading}>
              <Text accessibilityRole="header" style={styles.title}>{downloads ? 'Downloads' : 'Lessons'}</Text>
              <Text style={styles.subtitle}>{downloads ? 'Sample lessons saved on this device · all languages.' : 'Explore the AI-200 course preview.'}</Text>
            </View>
            {!downloads && <View style={styles.locale} accessibilityLabel="Lesson language">
              {(['en', 'fr'] as const).map(language => (
                <Pressable
                  key={language}
                  accessibilityRole="button"
                  accessibilityLabel={language === 'en' ? 'Read in English' : 'Lire en français'}
                  accessibilityState={{ selected: locale === language }}
                  onPress={() => selectLanguage(language)}
                  style={[styles.localeButton, locale === language && styles.localeActive]}
                >
                  <Text style={[styles.localeText, locale === language && { color: 'white' }]}>{language.toUpperCase()}</Text>
                </Pressable>
              ))}
            </View>}
          </View>
          {!downloads && <View style={[styles.hero, compact && { marginBottom: 20 }]}>
            <View style={[styles.heroCopy, compact && { padding: 20 }]}>
              <Text style={styles.heroKicker}>THE AI-200 LEARNING PATH</Text>
              <Text style={styles.heroTitle}>Azure AI Developer</Text>
              <Text style={styles.heroDescription}>Azure AI development, one clear idea at a time.</Text>
              <View style={styles.heroTags}>
                <Text style={styles.heroTag}>EN + FR</Text>
              </View>
            </View>
            <View
              style={[styles.art, compact && styles.compactArt]}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <View style={styles.orbit} />
              <View style={styles.orbitInner} />
              <View style={styles.blockBack} />
              <View style={styles.blockFront}>
                <Text style={styles.artSymbol}>↗</Text>
              </View>
              <View style={styles.artDot} />
            </View>
          </View>}
          <View style={styles.sectionHeading}>
            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>{downloads ? 'SAVED SAMPLES' : 'YOUR COURSE'}</Text>
              <Text accessibilityRole="header" style={styles.sectionTitle}>Azure AI Developer</Text>
            </View>
            <Text style={styles.courseCode}>AI-200</Text>
          </View>
          <View style={styles.courseCard}>
            <View style={styles.courseHeader}>
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={styles.cardTitle}>{downloads ? 'Saved lessons' : 'Course lessons'}</Text>
                <Text style={styles.body}>{downloads ? `${saved.length} saved localizations · English + français` : '2 of 8 unlocked · sample access only'}</Text>
              </View>
              {!downloads && (
                <Pressable
                  disabled={saving || loading}
                  onPress={() => void save()}
                  accessibilityRole="button"
                  accessibilityLabel={`${courseSaved ? 'Saved offline. Save all' : 'Save all'} unlocked sample lessons in ${locale === 'en' ? 'English' : 'French'}`}
                  accessibilityState={{ disabled: saving || loading, busy: saving }}
                  style={styles.save}
                >
                  <Text style={styles.saveText}>{saving ? 'Saving…' : courseSaved ? '✓  Saved offline' : '↓  Save offline'}</Text>
                </Pressable>
              )}
            </View>
            {!downloads && <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>}
            {loading && <Text accessibilityLiveRegion="polite" style={styles.body}>Loading saved samples…</Text>}
            {storageError && <View accessibilityLiveRegion="polite">
              <Text accessibilityRole="alert" style={styles.body}>{storageError}</Text>
              <Pressable accessibilityRole="button" onPress={() => void refresh()} style={styles.close}><Text style={styles.closeText}>Refresh saved samples</Text></Pressable>
            </View>}
            {downloads && !loading && !saved.length && <Text style={styles.body}>No samples saved yet. Save the unlocked samples from Lessons, then read them here offline.</Text>}
            {rows.map((lesson, index) => {
              const locked = !downloads && !unlockedIds.includes(lesson.id);
              const downloaded = saved.some(item => item.id === lesson.id && item.locale === lesson.locale);
              return <Pressable
                key={`${lesson.id}/${lesson.locale}`}
                accessibilityRole="button"
                accessibilityLabel={`${lesson.title}, ${lesson.locale.toUpperCase()}, ${locked ? 'locked sample' : downloaded ? 'saved offline' : 'not saved'}`}
                accessibilityState={{ disabled: locked }}
                disabled={locked}
                onPress={() => void open(lesson.id, lesson.locale)}
                style={({ pressed }) => [styles.lessonRow, pressed && styles.pressed]}
              >
                <View style={styles.lessonNumber}><Text style={styles.numberText}>{String(index + 1).padStart(2, '0')}</Text></View>
                <View style={styles.lessonCopy}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.body}>{locked ? 'Locked · sample access state' : `Synthetic sample · ${lesson.locale.toUpperCase()}`}</Text>
                  {!locked && <Text style={downloaded ? styles.ready : styles.body}>{downloaded ? '✓  Saved offline' : 'Not saved on this device'}</Text>}
                </View>
                {!locked && <Text style={styles.arrow}>↗</Text>}
              </Pressable>;
            })}
          </View>
          {result && (
            <Modal transparent animationType="fade" visible onRequestClose={closeReader}>
              <View style={styles.modalBackdrop}>
                <View style={styles.reader} accessibilityViewIsModal>
                  <View style={styles.readerHeader}>
                    <Text style={styles.kicker}>
                      {result.status === 'opened' ? 'LESSON PREVIEW' : 'CONNECTION REQUIRED'}
                    </Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Close lesson preview"
                      onPress={closeReader}
                      style={styles.close}
                    >
                      <Text style={styles.closeText}>Close ×</Text>
                    </Pressable>
                  </View>
                  <ScrollView contentContainerStyle={styles.readerBody}>
                    {result.status === 'opened' ? (
                      <>
                        <Text accessibilityRole="header" style={styles.sectionTitle}>
                          {previewLessons.find(lesson => lesson.id === result.lesson.id)?.title}
                        </Text>
                        <Text style={styles.reading}>{result.lesson.content}</Text>
                        <View style={styles.metadata}>
                          <Text style={styles.body}>
                            Version {result.lesson.version} · Sample verification date {result.lesson.verifiedOn}
                          </Text>
                          <Text style={styles.body}>Synthetic content · not a verified teaching lesson</Text>
                          <Text style={styles.body}>Lesson ID: {result.lesson.id}</Text>
                          {result.lesson.sourceLinks.map(link => (
                            <Pressable
                              key={link}
                              accessibilityRole="link"
                              accessibilityLabel="Open official Microsoft AI-200 study guide"
                              onPress={() => void openSource(link)}
                              style={styles.source}
                            >
                              <Text style={styles.sourceText}>Microsoft study guide ↗</Text>
                            </Pressable>
                          ))}
                          {sourceError && (
                            <Text accessibilityRole="alert" style={styles.body}>{sourceError}</Text>
                          )}
                        </View>
                      </>
                    ) : (
                      <Text style={styles.reading}>
                        This lesson is not downloaded in the requested language. Save the unlocked sample course in this language from Lessons first.
                      </Text>
                    )}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          )}
          <View style={styles.note}>
            <View style={styles.noteMark}>
              <Text style={styles.noteMarkText}>i</Text>
            </View>
            <Text style={styles.noteText}>Synthetic samples only. Save offline stores the 2 unlocked lessons in the selected language on this device. This is not a production course. Progress and sync are not connected.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F7F2'
  },
  scroll: {
    alignItems: 'center',
    paddingBottom: 120
  },
  page: {
    width: '100%',
    maxWidth: 1120,
    paddingHorizontal: 24,
    paddingTop: 92
  },

  topline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 42
  },
  wordmark: {
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -1,
    color: '#172D30'
  },
  preview: {
    backgroundColor: '#E9EBDD',
    borderRadius: 6,
    padding: 8
  },
  eyebrow: {
    color: '#4D594C',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2
  },

  headingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 30
  },
  heading: {
    flex: 1,
    minWidth: 230
  },
  kicker: {
    fontSize: 10,
    letterSpacing: 1.8,
    fontWeight: '800',
    color: '#08766F',
    marginBottom: 10
  },
  title: {
    fontSize: 43,
    lineHeight: 48,
    letterSpacing: -1.9,
    fontWeight: '800',
    color: '#183332'
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: '#657270',
    marginTop: 14
  },
  locale: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#E9EDE5'
  },
  localeButton: {
    paddingHorizontal: 15,
    minHeight: 40,
    justifyContent: 'center',
    borderRadius: 9
  },
  localeActive: {
    backgroundColor: '#173F3B'
  },
  localeText: {
    color: '#576761',
    fontSize: 12,
    fontWeight: '700'
  },

  compactPage: { paddingHorizontal: 18, paddingTop: 80 },
  compactArt: { height: 170, transform: [{ scale: 0.65 }, { translateY: -14 }], marginVertical: -35 },
  hero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#153E3B',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 36
  },
  heroCopy: {
    flexGrow: 1,
    flexBasis: 300,
    padding: 30,
    justifyContent: 'center'
  },
  heroKicker: {
    fontSize: 10,
    letterSpacing: 1.8,
    color: '#B4D9CD',
    fontWeight: '700'
  },
  heroTitle: {
    color: '#FFFCEB',
    fontSize: 36,
    lineHeight: 41,
    fontWeight: '700',
    letterSpacing: -1.1,
    marginTop: 20
  },
  heroDescription: {
    color: '#C4D8D2',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
    maxWidth: 320
  },
  heroTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 25
  },
  heroTag: {
    fontSize: 9,
    letterSpacing: 1,
    color: '#DDEDD9',
    borderWidth: 1,
    borderColor: '#5F8272',
    borderRadius: 6,
    padding: 8
  },
  art: {
    height: 270,
    width: 310,
    maxWidth: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  orbit: {
    width: 225,
    height: 225,
    borderRadius: 113,
    borderWidth: 1,
    borderColor: '#5B7D6E',
    position: 'absolute'
  },
  orbitInner: {
    width: 165,
    height: 165,
    borderRadius: 83,
    borderWidth: 1,
    borderColor: '#5B7D6E',
    position: 'absolute'
  },
  blockBack: {
    width: 100,
    height: 110,
    backgroundColor: '#C7E7A0',
    transform: [{
      rotate: '23deg'
    }],
    borderRadius: 16,
    position: 'absolute',
    top: 49,
    left: 81
  },
  blockFront: {
    width: 105,
    height: 112,
    backgroundColor: '#F2A56D',
    transform: [{
      rotate: '-12deg'
    }],
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    left: 26,
    top: 15
  },
  artSymbol: {
    fontSize: 65,
    fontWeight: '300',
    color: '#173F3B'
  },
  artDot: {
    position: 'absolute',
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: '#D3EFAC',
    top: 55,
    right: 41
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 24,
    letterSpacing: -.6,
    fontWeight: '700',
    color: '#213C37'
  },
  courseCode: {
    color: '#53654F',
    borderColor: '#D7DFCD',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 11,
    fontWeight: '700'
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E1E6DB',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 22
  },
  courseHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 18,
    paddingVertical: 24
  },
  cardTitle: {
    color: '#213C37',
    fontSize: 18,
    fontWeight: '700'
  },
  body: {
    color: '#65726D',
    fontSize: 12,
    lineHeight: 19
  },
  save: {
    backgroundColor: '#EBEFE7',
    paddingHorizontal: 14,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 9
  },
  saveText: {
    fontSize: 12,
    color: '#596B5F',
    fontWeight: '700'
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#EDF0E7',
    borderRadius: 3,
    marginBottom: 12
  },
  progressFill: {
    width: '25%',
    height: 5,
    backgroundColor: '#108378',
    borderRadius: 3
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 23,
    borderBottomWidth: 1,
    borderColor: '#EDF0E9'
  },
  lessonNumber: {
    width: 43,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0F1EA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  numberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A655A'
  },
  lessonCopy: {
    flex: 1,
    gap: 5
  },
  lessonTitle: {
    color: '#213C37',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21
  },
  ready: {
    color: '#087A61',
    fontSize: 11,
    fontWeight: '600'
  },
  arrow: {
    fontSize: 23,
    color: '#35675C',
    padding: 5
  },
  pressed: {
    opacity: .65
  },

  reader: {
    backgroundColor: '#EDF3E6',
    borderRadius: 18,
    padding: 24,
    width: '100%',
    maxWidth: 760,
    maxHeight: '90%',
    gap: 12
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(15, 35, 32, 0.55)'
  },
  readerBody: { gap: 12 },
  readerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  close: {
    minHeight: 44,
    justifyContent: 'center'
  },
  closeText: {
    color: '#315D51',
    fontSize: 12
  },
  reading: {
    color: '#243E37',
    lineHeight: 27,
    fontSize: 16
  },
  metadata: {
    gap: 6,
    borderTopWidth: 1,
    borderColor: '#D1DDC9',
    paddingTop: 15
  },
  source: {
    minHeight: 44,
    justifyContent: 'center'
  },
  sourceText: {
    color: '#08766F',
    fontSize: 13,
    textDecorationLine: 'underline'
  },
  note: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 24
  },
  noteMark: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#A5B4A4',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noteMarkText: {
    color: '#71856C',
    fontSize: 13
  },
  noteText: {
    flex: 1,
    color: '#758071',
    fontSize: 11,
    lineHeight: 18
  },


});
