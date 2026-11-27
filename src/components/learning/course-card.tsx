import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Pressable, View } from "react-native";
import { LessonRow, type LessonRowData } from "./lesson-row";
import type { LessonLocale } from "@/domain/learning/entities/lesson";

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
    <Card className="gap-0 bg-card border-border border-[1px] rounded-[18px] px-[22px] py-0 shadow-none">
      <View className="flex-row flex-wrap items-center gap-[18px] py-[24px]">
        <View className="flex-1 gap-[8px]">
          <Text className="text-foreground text-[18px] font-bold">
            {downloads ? "Saved lessons" : "Course lessons"}
          </Text>
          <Text className="text-muted-foreground text-[12px] leading-[19px]">
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
        <View className="h-[5px] bg-[#EDF0E7] rounded-[3px] mb-[12px]">
          <View className="w-[25%] h-[5px] bg-[#108378] rounded-[3px]" />
        </View>
      )}
      {loading && (
        <Text
          accessibilityLiveRegion="polite"
          className="text-muted-foreground text-[12px] leading-[19px]"
        >
          Loading saved samples…
        </Text>
      )}
      {storageError && (
        <View accessibilityLiveRegion="polite">
          <Text
            accessibilityRole="alert"
            className="text-muted-foreground text-[12px] leading-[19px]"
          >
            {storageError}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => void refresh()}
            className="min-h-[44px] justify-center"
          >
            <Text className="text-[#315D51] text-[12px]">
              Refresh saved samples
            </Text>
          </Pressable>
        </View>
      )}
      {downloads && !loading && !savedCount && (
        <Text className="text-muted-foreground text-[12px] leading-[19px]">
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
    </Card>
  );
}

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
    <Button
      variant="secondary"
      disabled={saving || loading}
      onPress={() => void save()}
      accessibilityRole="button"
      accessibilityLabel={`${courseSaved ? "Saved offline. Save all" : "Save all"} unlocked sample lessons in ${locale === "en" ? "English" : "French"}`}
      accessibilityState={{ disabled: saving || loading, busy: saving }}
      className="h-auto py-0 sm:h-auto bg-secondary px-[14px] min-h-[44px] justify-center rounded-[9px]"
    >
      <Text className="text-[12px] text-secondary-foreground font-bold">
        {saving
          ? "Saving…"
          : courseSaved
            ? "✓  Saved offline"
            : "↓  Save offline"}
      </Text>
    </Button>
  );
}
