import { Pressable, StyleSheet, Text, View } from "react-native";
import type { LessonLocale } from "@/domain/learning/entities/lesson";
import { sharedStyles } from "./learning-styles";

export type LessonRowData = {
  id: string;
  title: string;
  locale: LessonLocale;
  locked: boolean;
  downloaded: boolean;
};

export function LessonRow({
  lesson,
  index,
  open,
}: {
  lesson: LessonRowData;
  index: number;
  open: (id: string, language: LessonLocale) => Promise<void>;
}) {
  const { locked, downloaded } = lesson;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${lesson.title}, ${lesson.locale.toUpperCase()}, ${locked ? "locked sample" : downloaded ? "saved offline" : "not saved"}`}
      accessibilityState={{ disabled: locked }}
      disabled={locked}
      onPress={() => void open(lesson.id, lesson.locale)}
      style={({ pressed }) => [styles.lessonRow, pressed && styles.pressed]}
    >
      <View style={styles.lessonNumber}>
        <Text style={styles.numberText}>
          {String(index + 1).padStart(2, "0")}
        </Text>
      </View>
      <View style={styles.lessonCopy}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={sharedStyles.body}>
          {locked
            ? "Locked · sample access state"
            : `Synthetic sample · ${lesson.locale.toUpperCase()}`}
        </Text>
        {!locked && (
          <Text style={downloaded ? styles.ready : sharedStyles.body}>
            {downloaded ? "✓  Saved offline" : "Not saved on this device"}
          </Text>
        )}
      </View>
      {!locked && <Text style={styles.arrow}>↗</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 23,
    borderBottomWidth: 1,
    borderColor: "#EDF0E9",
  },
  lessonNumber: {
    width: 43,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F0F1EA",
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4A655A",
  },
  lessonCopy: {
    flex: 1,
    gap: 5,
  },
  lessonTitle: {
    color: "#213C37",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
  },
  ready: {
    color: "#087A61",
    fontSize: 11,
    fontWeight: "600",
  },
  arrow: {
    fontSize: 23,
    color: "#35675C",
    padding: 5,
  },
  pressed: {
    opacity: 0.65,
  },
});
