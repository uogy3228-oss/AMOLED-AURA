import React from 'react';
import { TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { LiquidGlassSurface } from './LiquidGlassSurface';
import { colors } from '../theme';
import { useT, usePreferences } from '../store/preferencesStore';

export function GlassSearchBar({ value, onChange, onSubmit, loading }: { value: string; onChange: (s: string) => void; onSubmit: () => void; loading?: boolean }) {
  const t = useT(); const rtl = usePreferences((s) => s.language === 'ar');
  return (
    <LiquidGlassSurface radius={999} style={styles.wrap}>
      <Search color={colors.accent} size={20} />
      <TextInput value={value} onChangeText={onChange} onSubmitEditing={onSubmit} returnKeyType="search"
        placeholder={t('searchPlaceholder')} placeholderTextColor={colors.textMuted}
        style={[styles.input, { textAlign: rtl ? 'right' : 'left' }]} accessibilityLabel={t('searchPlaceholder')} />
      {loading ? <ActivityIndicator color={colors.accent} /> : null}
      {value ? <Pressable onPress={() => onChange('')} accessibilityLabel={t('clear')} hitSlop={12} style={styles.btn}><X color={colors.textMuted} size={18} /></Pressable> : null}
    </LiquidGlassSurface>
  );
}
const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 52, gap: 10 },
  input: { flex: 1, color: colors.text, fontSize: 16, height: 52 }, btn: { minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' },
});
