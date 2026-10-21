import React, { useMemo } from 'react';
import { ScrollView, View, useWindowDimensions, ActivityIndicator, RefreshControl } from 'react-native';
import type { Wallpaper } from '../types';
import { WallpaperCard } from './WallpaperCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { colors } from '../theme';

const GAP = 12, PAD = 16;
/** Independent two-column flow: each item goes to the currently shorter column. */
export function splitColumns(items: Wallpaper[], width: number): [Wallpaper[], Wallpaper[]] {
  const cols: [Wallpaper[], Wallpaper[]] = [[], []]; const h = [0, 0];
  for (const it of items) { const i = h[0] <= h[1] ? 0 : 1; cols[i].push(it); h[i] += width * (it.thumbHeight / it.thumbWidth) + GAP; }
  return cols;
}
interface Props { items: Wallpaper[]; loading: boolean; loadingMore: boolean; onEnd: () => void; header?: React.ReactNode; onRefresh?: () => void; footer?: React.ReactNode }
export function WallpaperGrid({ items, loading, loadingMore, onEnd, header, onRefresh, footer }: Props) {
  const { width: screen } = useWindowDimensions();
  const colW = Math.floor((Math.min(screen, 900) - PAD * 2 - GAP) / 2);
  const [a, b] = useMemo(() => splitColumns(items, colW), [items, colW]);
  return (
    <ScrollView contentContainerStyle={{ padding: PAD, paddingBottom: 140 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
      scrollEventThrottle={64} refreshControl={onRefresh ? <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor={colors.accent} /> : undefined}
      onScroll={({ nativeEvent: e }) => { if (e.layoutMeasurement.height + e.contentOffset.y >= e.contentSize.height - 600) onEnd(); }}>
      {header}
      <View style={{ flexDirection: 'row', gap: GAP, justifyContent: 'center' }}>
        <View style={{ width: colW }}>{loading ? [260, 340, 300].map((h, i) => <LoadingSkeleton key={i} height={h} />) : a.map((w) => <WallpaperCard key={w.id} item={w} width={colW} />)}</View>
        <View style={{ width: colW }}>{loading ? [330, 270, 320].map((h, i) => <LoadingSkeleton key={i} height={h} />) : b.map((w) => <WallpaperCard key={w.id} item={w} width={colW} />)}</View>
      </View>
      {loadingMore ? <ActivityIndicator color={colors.accent} style={{ marginTop: 16 }} /> : null}
      {footer}
    </ScrollView>
  );
}
