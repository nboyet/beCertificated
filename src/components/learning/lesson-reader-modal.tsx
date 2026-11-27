import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { OpenDownloadedLessonResult } from "@/application/learning/open-downloaded-lesson.use-case";
import { previewLessons } from "./lesson-preview";
import { sharedStyles } from "./learning-styles";

export function LessonReaderModal({
  result,
  closeReader,
  openSource,
  sourceError,
}: {
  result: OpenDownloadedLessonResult;
  closeReader: () => void;
  openSource: (link: string) => Promise<void>;
  sourceError: string | null;
}) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible
      onRequestClose={closeReader}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.reader} accessibilityViewIsModal>
          <View style={styles.readerHeader}>
            <Text style={sharedStyles.kicker}>
              {result.status === "opened"
                ? "LESSON PREVIEW"
                : "CONNECTION REQUIRED"}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close lesson preview"
              onPress={closeReader}
              style={sharedStyles.close}
            >
              <Text style={sharedStyles.closeText}>Close ×</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.readerBody}>
            {result.status === "opened" ? (
              <>
                <Text
                  accessibilityRole="header"
                  style={sharedStyles.sectionTitle}
                >
                  {
                    previewLessons.find(
                      (lesson) => lesson.id === result.lesson.id,
                    )?.title
                  }
                </Text>
                <Text style={styles.reading}>{result.lesson.content}</Text>
                <View style={styles.metadata}>
                  <Text style={sharedStyles.body}>
                    Version {result.lesson.version} · Sample verification date{" "}
                    {result.lesson.verifiedOn}
                  </Text>
                  <Text style={sharedStyles.body}>
                    Synthetic content · not a verified teaching lesson
                  </Text>
                  <Text style={sharedStyles.body}>
                    Lesson ID: {result.lesson.id}
                  </Text>
                  {result.lesson.sourceLinks.map((link) => (
                    <Pressable
                      key={link}
                      accessibilityRole="link"
                      accessibilityLabel="Open official Microsoft AI-200 study guide"
                      onPress={() => void openSource(link)}
                      style={styles.source}
                    >
                      <Text style={styles.sourceText}>
                        Microsoft study guide ↗
                      </Text>
                    </Pressable>
                  ))}
                  {sourceError && (
                    <Text accessibilityRole="alert" style={sharedStyles.body}>
                      {sourceError}
                    </Text>
                  )}
                </View>
              </>
            ) : (
              <Text style={styles.reading}>
                This lesson is not downloaded in the requested language. Save
                the unlocked sample course in this language from Lessons first.
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  reader: {
    backgroundColor: "#EDF3E6",
    borderRadius: 18,
    padding: 24,
    width: "100%",
    maxWidth: 760,
    maxHeight: "90%",
    gap: 12,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(15, 35, 32, 0.55)",
  },
  readerBody: { gap: 12 },
  readerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  reading: {
    color: "#243E37",
    lineHeight: 27,
    fontSize: 16,
  },
  metadata: {
    gap: 6,
    borderTopWidth: 1,
    borderColor: "#D1DDC9",
    paddingTop: 15,
  },
  source: {
    minHeight: 44,
    justifyContent: "center",
  },
  sourceText: {
    color: "#08766F",
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
