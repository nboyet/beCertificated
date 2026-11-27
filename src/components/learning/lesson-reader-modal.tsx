import { Text } from "@/components/ui/text";
import { Modal, Pressable, ScrollView, View } from "react-native";
import type { OpenDownloadedLessonResult } from "@/application/learning/open-downloaded-lesson.use-case";
import { previewLessons } from "./lesson-preview";

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
      <View className="flex-1 justify-center items-center p-[20px] bg-[rgba(15,_35,_32,_0.55)]">
        <View
          className="bg-[#EDF3E6] rounded-[18px] p-[24px] w-[100%] max-w-[760px] max-h-[90%] gap-[12px]"
          accessibilityViewIsModal
        >
          <View className="flex-row items-center justify-between gap-[12px]">
            <Text className="text-[10px] tracking-[1.8px] font-extrabold text-[#08766F] mb-[10px]">
              {result.status === "opened"
                ? "LESSON PREVIEW"
                : "CONNECTION REQUIRED"}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close lesson preview"
              onPress={closeReader}
              className="min-h-[44px] justify-center"
            >
              <Text className="text-[#315D51] text-[12px]">Close ×</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerClassName="gap-[12px]">
            {result.status === "opened" ? (
              <>
                <Text
                  accessibilityRole="header"
                  className="text-[24px] tracking-[-0.6px] font-bold text-foreground"
                >
                  {
                    previewLessons.find(
                      (lesson) => lesson.id === result.lesson.id,
                    )?.title
                  }
                </Text>
                <Text className="text-[#243E37] leading-[27px] text-[16px]">
                  {result.lesson.content}
                </Text>
                <View className="gap-[6px] border-t-[1px] border-[#D1DDC9] pt-[15px]">
                  <Text className="text-muted-foreground text-[12px] leading-[19px]">
                    Version {result.lesson.version} · Sample verification date{" "}
                    {result.lesson.verifiedOn}
                  </Text>
                  <Text className="text-muted-foreground text-[12px] leading-[19px]">
                    Synthetic content · not a verified teaching lesson
                  </Text>
                  <Text className="text-muted-foreground text-[12px] leading-[19px]">
                    Lesson ID: {result.lesson.id}
                  </Text>
                  {result.lesson.sourceLinks.map((link) => (
                    <Pressable
                      key={link}
                      accessibilityRole="link"
                      accessibilityLabel="Open official Microsoft AI-200 study guide"
                      onPress={() => void openSource(link)}
                      className="min-h-[44px] justify-center"
                    >
                      <Text className="text-[#08766F] text-[13px] underline">
                        Microsoft study guide ↗
                      </Text>
                    </Pressable>
                  ))}
                  {sourceError && (
                    <Text
                      accessibilityRole="alert"
                      className="text-muted-foreground text-[12px] leading-[19px]"
                    >
                      {sourceError}
                    </Text>
                  )}
                </View>
              </>
            ) : (
              <Text className="text-[#243E37] leading-[27px] text-[16px]">
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
