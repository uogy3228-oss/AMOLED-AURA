import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { colors } from '../theme';
export function LoadingSkeleton({ height = 240, reduceMotion }: { height?: number; reduceMotion?: boolean }) {
  const o = useSharedValue(0.4);
  useEffect(() => { if (!reduceMotion) o.value = withRepeat(withTiming(0.9, { duration: 800 }), -1, true); }, [reduceMotion, o]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[{ height, borderRadius: 24, backgroundColor: colors.surface, marginBottom: 12 }, style]} />;
}
