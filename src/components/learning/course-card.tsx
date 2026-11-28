import type { LessonLocale } from "@/domain/learning/entities/lesson";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Pressable, View } from "react-native";
import { LessonRow, type LessonRowData } from "./lesson-row";

export function CourseCard({
  downloads,
  savedCount,
  saving,
  loading,
  courseSaved,
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
            {downloads ? "Leçons enregistrées" : "Leçons du cours"}
          </Text>
          <Text className="text-muted-foreground text-[12px] leading-[19px]">
            {downloads
              ? `${savedCount} leçon enregistrée · français`
              : "Toutes les leçons publiées sont accessibles"}
          </Text>
        </View>
        {!downloads && (
          <CourseSaveButton
            saving={saving}
            loading={loading}
            courseSaved={courseSaved}
            save={save}
          />
        )}
      </View>
      {loading && (
        <Text
          accessibilityLiveRegion="polite"
          className="text-muted-foreground text-[12px] leading-[19px]"
        >
          Chargement des leçons enregistrées…
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
              Actualiser les leçons enregistrées
            </Text>
          </Pressable>
        </View>
      )}
      {downloads && !loading && !savedCount && (
        <Text className="text-muted-foreground text-[12px] leading-[19px]">
          Aucune leçon téléchargée. Téléchargez le cours depuis Leçons pour le lire hors ligne.
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
  save,
}: {
  saving: boolean;
  loading: boolean;
  courseSaved: boolean;
  save: () => Promise<void>;
}) {
  return (
    <Button
      variant="secondary"
      disabled={saving || loading}
      onPress={() => void save()}
      accessibilityRole="button"
      accessibilityLabel={`${courseSaved ? "Cours disponible hors ligne. " : ""}Télécharger le cours en français`}
      accessibilityState={{ disabled: saving || loading, busy: saving }}
      className="h-auto py-0 sm:h-auto bg-secondary px-[14px] min-h-[44px] justify-center rounded-[9px]"
    >
      <Text className="text-[12px] text-secondary-foreground font-bold">
        {saving
          ? "Téléchargement…"
          : courseSaved
            ? "✓  Disponible hors ligne"
            : "↓  Télécharger"}
      </Text>
    </Button>
  );
}
