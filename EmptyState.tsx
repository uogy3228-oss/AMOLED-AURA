import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LiquidGlassSurface } from './LiquidGlassSurface';
import { colors } from '../theme';
export function EmptyState({ message, actionLabel, onAction }: { message: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.msg}>{message}</Text>
      {actionLabel && onAction ? <LiquidGlassSurface radius={999} onPress={onAction} style={styles.btn}><Text style={styles.btnText}>{actionLabel}</Text></LiquidGlassSurface> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { alignItems: 'center', padding: 32, gap: 16 }, msg: { color: colors.textMuted, fontSize: 16, textAlign: 'center' },
  btn: { paddingHorizontal: 24, minHeight: 44, justifyContent: 'center' }, btnText: { color: colors.accent, fontWeight: '700' },
});
