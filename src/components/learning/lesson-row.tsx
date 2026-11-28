import { Text } from "@/components/ui/text";
import { Pressable, View } from "react-native";
import type { LessonLocale } from "@/domain/learning/entities/lesson";

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
      accessibilityLabel={`${lesson.title}, ${lesson.locale.toUpperCase()}, ${locked ? "locked sample" : downloaded ? "disponible hors ligne" : "non téléchargée"}`}
      accessibilityState={{ disabled: locked }}
      disabled={locked}
      onPress={() => void open(lesson.id, lesson.locale)}
      className="flex-row items-center gap-[14px] py-[23px] border-b-[1px] border-[#EDF0E9] active:opacity-[0.65]"
    >
      <View className="w-[43px] h-[48px] rounded-[12px] bg-[#F0F1EA] items-center justify-center">
        <Text className="text-[14px] font-bold text-[#4A655A]">
          {String(index + 1).padStart(2, "0")}
        </Text>
      </View>
      <View className="flex-1 gap-[5px]">
        <Text className="text-foreground text-[15px] font-semibold leading-[21px]">
          {lesson.title}
        </Text>
        <Text className="text-muted-foreground text-[12px] leading-[19px]">
          {locked
            ? "Locked · sample access state"
            : `Leçon · ${lesson.locale.toUpperCase()}`}
        </Text>
        {!locked && (
          <Text
            className={
              downloaded
                ? "text-[#087A61] text-[11px] font-semibold"
                : "text-muted-foreground text-[12px] leading-[19px]"
            }
          >
            {downloaded ? "✓  Disponible hors ligne" : "Non téléchargée sur cet appareil"}
          </Text>
        )}
      </View>
      {!locked && <Text className="text-[23px] text-[#35675C] p-[5px]">↗</Text>}
    </Pressable>
  );
}
