import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Home, Compass, Heart, CalendarDays, Settings } from 'lucide-react-native';
import { LiquidGlassSurface } from './LiquidGlassSurface';
import { useT } from '../store/preferencesStore';
import { colors } from '../theme';

const ICONS: Record<string, any> = { index: Home, explore: Compass, favorites: Heart, calendar: CalendarDays, settings: Settings };
const LABEL: Record<string, any> = { index: 'home', explore: 'explore', favorites: 'favorites', calendar: 'calendar', settings: 'settings' };

export function BottomGlassNavigation({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets(); const t = useT();
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: Math.max(insets.bottom, 12) }]}>
      <LiquidGlassSurface radius={999} intensity={60} style={styles.bar}>
        {state.routes.map((route, i) => {
          const active = state.index === i; const Icon = ICONS[route.name]; const label = t(LABEL[route.name]);
          const press = () => { const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true }); if (!active && !e.defaultPrevented) navigation.navigate(route.name); };
          return (
            <Pressable key={route.key} onPress={press} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: active }}>
              <Animated.View layout={LinearTransition.duration(200)} style={[styles.item, active && styles.itemActive]}>
                <Icon size={22} color={active ? colors.accent : colors.textMuted} />
                {active ? <Text style={styles.label} numberOfLines={1}>{label}</Text> : null}
              </Animated.View>
            </Pressable>
          );
        })}
      </LiquidGlassSurface>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  bar: { flexDirection: 'row', alignItems: 'center', padding: 8, gap: 4 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 48, height: 48, justifyContent: 'center', paddingHorizontal: 12, borderRadius: 999 },
  itemActive: { backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.border }, label: { color: colors.accent, fontWeight: '700' },
});
