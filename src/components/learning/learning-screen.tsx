import type { LessonLocale } from '@/domain/learning/entities/lesson';
import { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLearningScreen } from "./use-learning-screen";
import { CourseHero } from "./course-hero";
import { CourseCard } from "./course-card";
import { LessonReaderModal } from "./lesson-reader-modal";
import { sharedStyles } from "./learning-styles";

export function LearningScreen({ downloads = false }: { downloads?: boolean }) {
  const { width } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const compact = (Platform.OS !== "web" || mounted) && width <= 740;
  const {
    locale,
    sourceError,
    result,
    saved,
    loading,
    saving,
    storageError,
    refresh,
    open,
    selectLanguage,
    save,
    courseSaved,
    closeReader,
    rows,
    openSource,
  } = useLearningScreen(downloads);
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.page, compact && styles.compactPage]}>
          <View style={[styles.topline, compact && { marginBottom: 20 }]}>
            <Text style={styles.wordmark}>
              be<Text style={{ color: "#087D74" }}>Certified</Text>
              <Text style={{ color: "#EE764F" }}>.</Text>
            </Text>
            <View style={styles.preview}>
              <Text style={styles.eyebrow}>DESIGN PREVIEW</Text>
            </View>
          </View>
          <View style={[styles.headingRow, compact && { marginBottom: 20 }]}>
            <View style={styles.heading}>
              <Text accessibilityRole="header" style={styles.title}>
                {downloads ? "Downloads" : "Lessons"}
              </Text>
              <Text style={styles.subtitle}>
                {downloads
                  ? "Sample lessons saved on this device · all languages."
                  : "Explore the AI-200 course preview."}
              </Text>
            </View>
            {!downloads && (
              <LanguageSelector
                locale={locale}
                selectLanguage={selectLanguage}
              />
            )}
          </View>
          {!downloads && <CourseHero compact={compact} />}
          <View style={styles.sectionHeading}>
            <View style={{ flex: 1 }}>
              <Text style={sharedStyles.kicker}>
                {downloads ? "SAVED SAMPLES" : "YOUR COURSE"}
              </Text>
              <Text
                accessibilityRole="header"
                style={sharedStyles.sectionTitle}
              >
                Azure AI Developer
              </Text>
            </View>
            <Text style={styles.courseCode}>AI-200</Text>
          </View>
          <CourseCard
            downloads={downloads}
            savedCount={saved.length}
            saving={saving}
            loading={loading}
            courseSaved={courseSaved}
            locale={locale}
            save={save}
            storageError={storageError}
            refresh={refresh}
            rows={rows}
            open={open}
          />
          {result && (
            <LessonReaderModal
              result={result}
              closeReader={closeReader}
              openSource={openSource}
              sourceError={sourceError}
            />
          )}
          <View style={styles.note}>
            <View style={styles.noteMark}>
              <Text style={styles.noteMarkText}>i</Text>
            </View>
            <Text style={styles.noteText}>
              Synthetic samples only. Save offline stores the 2 unlocked lessons
              in the selected language on this device. This is not a production
              course. Progress and sync are not connected.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7F7F2",
  },
  scroll: {
    alignItems: "center",
    paddingBottom: 120,
  },
  page: {
    width: "100%",
    maxWidth: 1120,
    paddingHorizontal: 24,
    paddingTop: 92,
  },

  topline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 42,
  },
  wordmark: {
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -1,
    color: "#172D30",
  },
  preview: {
    backgroundColor: "#E9EBDD",
    borderRadius: 6,
    padding: 8,
  },
  eyebrow: {
    color: "#4D594C",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  headingRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 20,
    marginBottom: 30,
  },
  heading: {
    flex: 1,
    minWidth: 230,
  },
  title: {
    fontSize: 43,
    lineHeight: 48,
    letterSpacing: -1.9,
    fontWeight: "800",
    color: "#183332",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#657270",
    marginTop: 14,
  },
  compactPage: { paddingHorizontal: 18, paddingTop: 80 },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  courseCode: {
    color: "#53654F",
    borderColor: "#D7DFCD",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 11,
    fontWeight: "700",
  },
  note: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingVertical: 24,
  },
  noteMark: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#A5B4A4",
    alignItems: "center",
    justifyContent: "center",
  },
  noteMarkText: {
    color: "#71856C",
    fontSize: 13,
  },
  noteText: {
    flex: 1,
    color: "#758071",
    fontSize: 11,
    lineHeight: 18,
  },
});

function LanguageSelector({
  locale,
  selectLanguage,
}: {
  locale: LessonLocale;
  selectLanguage: (language: LessonLocale) => void;
}) {
  return (
    <View style={localStyles.locale} accessibilityLabel="Lesson language">
      {(["en", "fr"] as const).map((language) => (
        <Pressable
          key={language}
          accessibilityRole="button"
          accessibilityLabel={
            language === "en" ? "Read in English" : "Lire en français"
          }
          accessibilityState={{ selected: locale === language }}
          onPress={() => selectLanguage(language)}
          style={[
            localStyles.localeButton,
            locale === language && localStyles.localeActive,
          ]}
        >
          <Text
            style={[
              localStyles.localeText,
              locale === language && { color: "white" },
            ]}
          >
            {language.toUpperCase()}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const localStyles = StyleSheet.create({
  locale: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    backgroundColor: "#E9EDE5",
  },
  localeButton: {
    paddingHorizontal: 15,
    minHeight: 40,
    justifyContent: "center",
    borderRadius: 9,
  },
  localeActive: {
    backgroundColor: "#173F3B",
  },
  localeText: {
    color: "#576761",
    fontSize: 12,
    fontWeight: "700",
  },
});
