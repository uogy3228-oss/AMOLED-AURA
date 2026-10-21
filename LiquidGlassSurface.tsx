import React from 'react';
import { Platform, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

interface Props {
  radius?: number; intensity?: number; tint?: string; borderColor?: string; borderOpacity?: number;
  shadow?: boolean; onPress?: () => void; style?: StyleProp<ViewStyle>; children?: React.ReactNode;
  accessibilityLabel?: string; accessibilityRole?: 'button' | 'tab' | 'none'; accessibilityState?: { selected?: boolean };
}
export function LiquidGlassSurface({ radius = 24, intensity = 35, tint = colors.glass, borderColor = colors.accent,
  borderOpacity = 0.28, shadow = true, onPress, style, children, accessibilityLabel, accessibilityRole, accessibilityState }: Props) {
  const body = (
    <View style={[{ borderRadius: radius, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth * 1.5, borderColor: withAlpha(borderColor, borderOpacity) },
      shadow && styles.shadow, style]}>
      {Platform.OS === 'web' ? null : <BlurView intensity={intensity} tint="light" experimentalBlurMethod="dimezisBlurView" style={StyleSheet.absoluteFill} />}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: tint }]} />
      {/* diagonal sheen: the "liquid" body of the glass */}
      <LinearGradient pointerEvents="none" colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.02)', 'rgba(39,216,232,0.07)']} locations={[0, 0.45, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      {/* specular highlight along the top edge */}
      <LinearGradient pointerEvents="none" colors={['rgba(255,255,255,0.30)', 'rgba(255,255,255,0)']} start={{ x: 0.2, y: 0 }} end={{ x: 0.5, y: 0.55 }} style={StyleSheet.absoluteFill} />
      {/* inner light rim */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: radius, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' }]} />
      {children}
    </View>
  );
  if (!onPress) return body;
  return <Pressable onPress={onPress} accessibilityRole={accessibilityRole ?? 'button'} accessibilityLabel={accessibilityLabel}
    accessibilityState={accessibilityState} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>{body}</Pressable>;
}
function withAlpha(hex: string, a: number) {
  if (!hex.startsWith('#') || hex.length !== 7) return hex;
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
const styles = StyleSheet.create({ shadow: { shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 8 } });
