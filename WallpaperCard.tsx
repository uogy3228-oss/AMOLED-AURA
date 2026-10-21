import React, { useState } from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import type { Wallpaper } from '../types';
import { useFavorites } from '../store/favoritesStore';
import { useT } from '../store/preferencesStore';
import { colors } from '../theme';
import { rememberWallpaper } from '../utils/memory';

export const WallpaperCard = React.memo(function WallpaperCard({ item, width }: { item: Wallpaper; width: number }) {
  const router = useRouter(); const t = useT();
  const fav = useFavorites((s) => !!s.items[item.id]); const toggle = useFavorites((s) => s.toggle);
  const [failed, setFailed] = useState(false);
  const height = Math.round(width * (item.thumbHeight / item.thumbWidth));
  return (
    <Pressable onPress={() => { rememberWallpaper(item); router.push(`/wallpaper/${item.id}`); }} accessibilityRole="button" accessibilityLabel={item.title}
      style={[styles.card, { width, height }]}>
      {failed ? <View style={styles.fail}><Text style={styles.failText}>{t('imageUnavailable')}</Text></View> :
        <Image source={{ uri: item.thumbUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} cachePolicy="disk" onError={() => setFailed(true)} recyclingKey={item.id} />}
      <Pressable onPress={() => toggle(item)} hitSlop={10} accessibilityRole="button" accessibilityLabel={fav ? t('unfavorite') : t('favorite')} style={styles.heart}>
        <Heart size={20} color={fav ? colors.favorite : '#fff'} fill={fav ? colors.favorite : 'transparent'} />
      </Pressable>
    </Pressable>
  );
});
const styles = StyleSheet.create({
  card: { borderRadius: 24, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  heart: { position: 'absolute', top: 10, right: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  fail: { flex: 1, alignItems: 'center', justifyContent: 'center' }, failText: { color: colors.textMuted },
});
