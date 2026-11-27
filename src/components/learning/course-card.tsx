import { Pressable, StyleSheet, Text, View } from "react-native";
import { LessonRow, type LessonRowData } from "./lesson-row";
import type { LessonLocale } from "@/domain/learning/entities/lesson";
import { sharedStyles } from "./learning-styles";

export function CourseCard({
  downloads,
  savedCount,
  saving,
  loading,
  courseSaved,
  locale,
  save,
  storageError,
  refresh,
  rows,
  open,
}: {
  downloads: boolean;
  savedCount: number;
  saving: boolean;
  loading: boolean;
  courseSaved: boolean;
  locale: LessonLocale;
  save: () => Promise<void>;
  storageError: string | null;
  refresh: () => Promise<void>;
  rows: LessonRowData[];
  open: (id: string, language: LessonLocale) => Promise<void>;
}) {
  return (
    <View style={styles.courseCard}>
      <View style={styles.courseHeader}>
        <View style={{ flex: 1, gap: 8 }}>
          <Text style={styles.cardTitle}>
            {downloads ? "Saved lessons" : "Course lessons"}
          </Text>
          <Text style={sharedStyles.body}>
            {downloads
              ? `${savedCount} saved localizations · English + français`
              : "2 of 8 unlocked · sample access only"}
          </Text>
        </View>
        {!downloads && (
          <CourseSaveButton
            saving={saving}
            loading={loading}
            courseSaved={courseSaved}
            locale={locale}
            save={save}
          />
        )}
      </View>
      {!downloads && (
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      )}
      {loading && (
        <Text accessibilityLiveRegion="polite" style={sharedStyles.body}>
          Loading saved samples…
        </Text>
      )}
      {storageError && (
        <View accessibilityLiveRegion="polite">
          <Text accessibilityRole="alert" style={sharedStyles.body}>
            {storageError}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => void refresh()}
            style={sharedStyles.close}
          >
            <Text style={sharedStyles.closeText}>Refresh saved samples</Text>
          </Pressable>
        </View>
      )}
      {downloads && !loading && !savedCount && (
        <Text style={sharedStyles.body}>
          No samples saved yet. Save the unlocked samples from Lessons, then
          read them here offline.
        </Text>
      )}
      {rows.map((lesson, index) => (
        <LessonRow
          key={`${lesson.id}/${lesson.locale}`}
          lesson={lesson}
          index={index}
          open={open}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  courseCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E6DB",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 22,
  },
  courseHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 18,
    paddingVertical: 24,
  },
  cardTitle: {
    color: "#213C37",
    fontSize: 18,
    fontWeight: "700",
  },
  progressTrack: {
    height: 5,
    backgroundColor: "#EDF0E7",
    borderRadius: 3,
    marginBottom: 12,
  },
  progressFill: {
    width: "25%",
    height: 5,
    backgroundColor: "#108378",
    borderRadius: 3,
  },
});

function CourseSaveButton({
  saving,
  loading,
  courseSaved,
  locale,
  save,
}: {
  saving: boolean;
  loading: boolean;
  courseSaved: boolean;
  locale: LessonLocale;
  save: () => Promise<void>;
}) {
  return (
    <Pressable
      disabled={saving || loading}
      onPress={() => void save()}
      accessibilityRole="button"
      accessibilityLabel={`${courseSaved ? "Saved offline. Save all" : "Save all"} unlocked sample lessons in ${locale === "en" ? "English" : "French"}`}
      accessibilityState={{ disabled: saving || loading, busy: saving }}
      style={localStyles.save}
    >
      <Text style={localStyles.saveText}>
        {saving
          ? "Saving…"
          : courseSaved
            ? "✓  Saved offline"
            : "↓  Save offline"}
      </Text>
    </Pressable>
  );
}

const localStyles = StyleSheet.create({
  save: {
    backgroundColor: "#EBEFE7",
    paddingHorizontal: 14,
    minHeight: 44,
    justifyContent: "center",
    borderRadius: 9,
  },
  saveText: {
    fontSize: 12,
    color: "#596B5F",
    fontWeight: "700",
  },
});
