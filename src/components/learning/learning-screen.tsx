import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { LessonLocale } from "@/domain/learning/entities/lesson";
import { useEffect, useState } from "react";
import {
  Platform,
  Text as RNText,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView as NativeSafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";
import { useLearningScreen } from "./use-learning-screen";
import { CourseHero } from "./course-hero";
import { CourseCard } from "./course-card";
import { LessonReaderModal } from "./lesson-reader-modal";

const SafeAreaView = withUniwind(NativeSafeAreaView);

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
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["top", "left", "right"]}
    >
      <ScrollView contentContainerClassName="items-center pb-[120px]">
        <View
          className={cn(
            "w-[100%] max-w-[1120px] px-[24px] pt-[92px]",
            compact && "px-[18px] pt-[80px]",
          )}
        >
          <View
            className={cn(
              "flex-row items-center justify-between flex-wrap gap-[12px] mb-[42px]",
              compact && "mb-[20px]",
            )}
          >
            <Text className="text-[25px] font-extrabold tracking-[-1px] text-[#172D30]">
              be<RNText className="text-[#087D74]">Certified</RNText>
              <RNText className="text-[#EE764F]">.</RNText>
            </Text>
            <View className="bg-[#E9EBDD] rounded-[6px] p-[8px]">
              <Text className="text-[#4D594C] text-[10px] font-bold tracking-[1.2px]">
                DESIGN PREVIEW
              </Text>
            </View>
          </View>
          <View
            className={cn(
              "flex-row items-end flex-wrap gap-[20px] mb-[30px]",
              compact && "mb-[20px]",
            )}
          >
            <View className="flex-1 min-w-[230px]">
              <Text
                accessibilityRole="header"
                className="text-[43px] leading-[48px] tracking-[-1.9px] font-extrabold text-[#183332]"
              >
                {downloads ? "Downloads" : "Lessons"}
              </Text>
              <Text className="text-[15px] leading-[23px] text-[#657270] mt-[14px]">
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
          <View className="flex-row items-center gap-[14px] mb-[20px]">
            <View className="flex-1">
              <Text className="text-[10px] tracking-[1.8px] font-extrabold text-[#08766F] mb-[10px]">
                {downloads ? "SAVED SAMPLES" : "YOUR COURSE"}
              </Text>
              <Text
                accessibilityRole="header"
                className="text-[24px] tracking-[-0.6px] font-bold text-foreground"
              >
                Azure AI Developer
              </Text>
            </View>
            <Text className="text-[#53654F] border-[#D7DFCD] border-[1px] rounded-[8px] p-[10px] text-[11px] font-bold">
              AI-200
            </Text>
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
          <View className="flex-row gap-[12px] items-center py-[24px]">
            <View className="w-[25px] h-[25px] rounded-[13px] border-[1px] border-[#A5B4A4] items-center justify-center">
              <Text className="text-[#71856C] text-[13px]">i</Text>
            </View>
            <Text className="flex-1 text-[#758071] text-[11px] leading-[18px]">
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

function LanguageSelector({
  locale,
  selectLanguage,
}: {
  locale: LessonLocale;
  selectLanguage: (language: LessonLocale) => void;
}) {
  return (
    <View
      className="flex-row p-[4px] rounded-[12px] bg-[#E9EDE5]"
      accessibilityLabel="Lesson language"
    >
      {(["en", "fr"] as const).map((language) => (
        <Pressable
          key={language}
          accessibilityRole="button"
          accessibilityLabel={
            language === "en" ? "Read in English" : "Lire en français"
          }
          accessibilityState={{ selected: locale === language }}
          onPress={() => selectLanguage(language)}
          className={cn(
            "px-[15px] min-h-[40px] justify-center rounded-[9px]",
            locale === language && "bg-[#173F3B]",
          )}
        >
          <Text
            className={cn(
              "text-[#576761] text-[12px] font-bold",
              locale === language && "text-white",
            )}
          >
            {language.toUpperCase()}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
