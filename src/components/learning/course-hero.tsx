import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { View } from "react-native";

export function CourseHero({ compact }: { compact: boolean }) {
  return (
    <View
      className={cn(
        "flex-row flex-wrap bg-[#153E3B] rounded-[24px] overflow-hidden mb-[36px]",
        compact && "mb-[20px]",
      )}
    >
      <View
        className={cn(
          "grow basis-[300px] p-[30px] justify-center",
          compact && "p-[20px]",
        )}
      >
        <Text className="text-[10px] tracking-[1.8px] text-[#B4D9CD] font-bold">
          VOTRE PARCOURS AI-200
        </Text>
        <Text className="text-[#FFFCEB] text-[36px] leading-[41px] font-bold tracking-[-1.1px] mt-[20px]">
          AI-200 · Azure
        </Text>
        <Text className="text-[#C4D8D2] text-[14px] leading-[22px] mt-[14px] max-w-[320px]">
          Comprendre Azure AI, une idée à la fois.
        </Text>
        <View className="flex-row flex-wrap gap-[8px] mt-[25px]">
          <Text className="text-[9px] tracking-[1px] text-[#DDEDD9] border-[1px] border-[#5F8272] rounded-[6px] p-[8px]">
            FRANÇAIS
          </Text>
        </View>
      </View>
      <View
        className={cn(
          "h-[270px] w-[310px] max-w-[100%] self-center justify-center items-center",
          compact && "h-[170px] my-[-35px]",
        )}
        style={
          compact
            ? { transform: [{ scale: 0.65 }, { translateY: -14 }] }
            : undefined
        }
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View className="w-[225px] h-[225px] rounded-[113px] border-[1px] border-[#5B7D6E] absolute" />
        <View className="w-[165px] h-[165px] rounded-[83px] border-[1px] border-[#5B7D6E] absolute" />
        <View
          className="w-[100px] h-[110px] bg-[#C7E7A0] rounded-[16px] absolute top-[49px] left-[81px]"
          style={{ transform: [{ rotate: "23deg" }] }}
        />
        <View
          className="w-[105px] h-[112px] bg-[#F2A56D] rounded-[16px] justify-center items-center left-[26px] top-[15px]"
          style={{ transform: [{ rotate: "-12deg" }] }}
        >
          <Text className="text-[65px] font-light text-[#173F3B]">↗</Text>
        </View>
        <View className="absolute w-[19px] h-[19px] rounded-[10px] bg-[#D3EFAC] top-[55px] right-[41px]" />
      </View>
    </View>
  );
}
