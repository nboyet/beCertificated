import { Tabs, TabList, TabTrigger, TabSlot, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function AppTabs() {
  return (
    <Tabs style={{ flex: 1 }}>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <View style={styles.nav}>
          <Text style={styles.brand}>bC<Text style={{ color: '#EF9A65' }}>.</Text></Text>
          <TabTrigger name="lessons" href="/" asChild>
            <TabButton>Leçons</TabButton>
          </TabTrigger>
          <TabTrigger name="downloads" href="/explore" asChild>
            <TabButton>Téléchargements</TabButton>
          </TabTrigger>
        </View>
      </TabList>
    </Tabs>
  );
}

function TabButton({ children, isFocused, ref: _ref, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={[styles.tab, isFocused ? styles.active : styles.inactive]}
    >
      <Text style={[styles.label, { color: isFocused ? '#FFFCEB' : '#C1D4C8' }]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 17,
    backgroundColor: '#173F3B',
    padding: 7,
    maxWidth: '95%',
    shadowColor: '#142D21',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
  },
  brand: { fontWeight: '800', fontSize: 22, color: '#FFFCEB', paddingHorizontal: 13 },
  tab: { minHeight: 44, paddingHorizontal: 20, justifyContent: 'center', borderRadius: 11 },
  active: { backgroundColor: '#355B50' },
  inactive: { backgroundColor: 'transparent' },
  label: { fontSize: 12, fontWeight: '600' },
});
