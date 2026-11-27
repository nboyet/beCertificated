import { StyleSheet, Text, View } from "react-native";

export function CourseHero({ compact }: { compact: boolean }) {
  return (
    <View style={[styles.hero, compact && { marginBottom: 20 }]}>
      <View style={[styles.heroCopy, compact && { padding: 20 }]}>
        <Text style={styles.heroKicker}>THE AI-200 LEARNING PATH</Text>
        <Text style={styles.heroTitle}>Azure AI Developer</Text>
        <Text style={styles.heroDescription}>
          Azure AI development, one clear idea at a time.
        </Text>
        <View style={styles.heroTags}>
          <Text style={styles.heroTag}>EN + FR</Text>
        </View>
      </View>
      <View
        style={[styles.art, compact && styles.compactArt]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View style={styles.orbit} />
        <View style={styles.orbitInner} />
        <View style={styles.blockBack} />
        <View style={styles.blockFront}>
          <Text style={styles.artSymbol}>↗</Text>
        </View>
        <View style={styles.artDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#153E3B",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 36,
  },
  heroCopy: {
    flexGrow: 1,
    flexBasis: 300,
    padding: 30,
    justifyContent: "center",
  },
  heroKicker: {
    fontSize: 10,
    letterSpacing: 1.8,
    color: "#B4D9CD",
    fontWeight: "700",
  },
  heroTitle: {
    color: "#FFFCEB",
    fontSize: 36,
    lineHeight: 41,
    fontWeight: "700",
    letterSpacing: -1.1,
    marginTop: 20,
  },
  heroDescription: {
    color: "#C4D8D2",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
    maxWidth: 320,
  },
  heroTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 25,
  },
  heroTag: {
    fontSize: 9,
    letterSpacing: 1,
    color: "#DDEDD9",
    borderWidth: 1,
    borderColor: "#5F8272",
    borderRadius: 6,
    padding: 8,
  },
  art: {
    height: 270,
    width: 310,
    maxWidth: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  compactArt: {
    height: 170,
    transform: [{ scale: 0.65 }, { translateY: -14 }],
    marginVertical: -35,
  },
  orbit: {
    width: 225,
    height: 225,
    borderRadius: 113,
    borderWidth: 1,
    borderColor: "#5B7D6E",
    position: "absolute",
  },
  orbitInner: {
    width: 165,
    height: 165,
    borderRadius: 83,
    borderWidth: 1,
    borderColor: "#5B7D6E",
    position: "absolute",
  },
  blockBack: {
    width: 100,
    height: 110,
    backgroundColor: "#C7E7A0",
    transform: [
      {
        rotate: "23deg",
      },
    ],
    borderRadius: 16,
    position: "absolute",
    top: 49,
    left: 81,
  },
  blockFront: {
    width: 105,
    height: 112,
    backgroundColor: "#F2A56D",
    transform: [
      {
        rotate: "-12deg",
      },
    ],
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    left: 26,
    top: 15,
  },
  artSymbol: {
    fontSize: 65,
    fontWeight: "300",
    color: "#173F3B",
  },
  artDot: {
    position: "absolute",
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "#D3EFAC",
    top: 55,
    right: 41,
  },
});
