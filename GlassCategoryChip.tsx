import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LiquidGlassSurface } from './LiquidGlassSurface';
import { colors } from '../theme';

export function GlassCategoryChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <LiquidGlassSurface radius={18} onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }} accessibilityLabel={label}
      tint={active ? colors.accentSoft : 'rgba(255,255,255,0.05)'} borderOpacity={active ? 0.9 : 0.2} shadow={false} style={styles.chip}>
      <Text style={[styles.text, active && { color: colors.accent, fontWeight: '700' }]}>{label}</Text>
    </LiquidGlassSurface>
  );
}
const styles = StyleSheet.create({ chip: { paddingHorizontal: 18, minHeight: 44, justifyContent: 'center' }, text: { color: colors.textMuted, fontSize: 15 } });
