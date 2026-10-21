import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Linking, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Heart, Download } from 'lucide-react-native';
import { LiquidGlassSurface } from '../../src/components/LiquidGlassSurface';
import { DownloadProgressToast } from '../../src/components/DownloadProgressToast';
import { EmptyState } from '../../src/components/EmptyState';
import { getWallpaperDetails } from '../../src/services/wikimediaApi';
import { downloadWallpaper, useDownloads } from '../../src/services/downloadService';
import { useFavorites } from '../../src/store/favoritesStore';
import { usePreferences, useT } from '../../src/store/preferencesStore';
import { recallWallpaper, rememberWallpaper } from '../../src/utils/memory';
import type { Wallpaper } from '../../src/types';
import { colors } from '../../src/theme';

export default function WallpaperDetails() {
  const { id } = useLocalSearchParams<{ id: string }>(); const router = useRouter(); const t = useT();
  const rtl = usePreferences((s) => s.language === 'ar');
  const fav = useFavorites((s) => s.items[id!]); const toggle = useFavorites((s) => s.toggle);
  const [w, setW] = useState<Wallpaper | undefined>(() => recallWallpaper(id!) ?? fav);
  const [failed, setFailed] = useState(false);
  const busy = useDownloads((s) => ['downloading', 'saving'].includes(s.jobs[id!]?.status ?? ''));
  useEffect(() => { // refresh full details (attribution etc.); keep the passed item if the request fails
    const c = new AbortController();
    getWallpaperDetails(id!, c.signal).then((d) => { if (d) { rememberWallpaper(d); setW(d); } }).catch(() => {});
    return () => c.abort();
  }, [id]);
  const Back = rtl ? ArrowRight : ArrowLeft;
  if (!w) return <SafeAreaView style={styles.root}><ActivityIndicator color={colors.accent} /></SafeAreaView>;
  const isFav = !!fav;
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={{ aspectRatio: w.width / w.height, maxHeight: 640, width: '100%' }}>
          {failed ? <EmptyState message={t('imageUnavailable')} /> :
            <Image source={{ uri: w.thumbUrl }} style={StyleSheet.absoluteFill} contentFit="contain" onError={() => setFailed(true)} />}
        </View>
        <View style={{ padding: 20, gap: 8 }}>
          <Text style={styles.title}>{w.title}</Text>
          <Text style={styles.meta}>{t('dimensions')}: {w.width} × {w.height}</Text>
          <Text style={styles.meta}>{t('creator')}: {w.creator ?? t('unknown')}</Text>
          <Text style={styles.meta}>{t('license')}: {w.license ?? t('unknown')}</Text>
          {w.licenseUrl ? <Pressable onPress={() => Linking.openURL(w.licenseUrl!)}><Text style={styles.link}>{w.license}</Text></Pressable> : null}
          <Pressable onPress={() => Linking.openURL(w.pageUrl)} accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center' }}><Text style={styles.link}>{t('source')}</Text></Pressable>
        </View>
      </ScrollView>
      <SafeAreaView edges={['top']} pointerEvents="box-none" style={styles.top}>
        <LiquidGlassSurface radius={999} onPress={() => router.back()} accessibilityLabel={t('back')} style={styles.round}><Back color={colors.text} /></LiquidGlassSurface>
      </SafeAreaView>
      <SafeAreaView edges={['bottom']} pointerEvents="box-none" style={styles.bottom}>
        <View style={{ flexDirection: 'row', gap: 12, paddingBottom: 12 }}>
          <LiquidGlassSurface radius={999} onPress={() => toggle(w)} accessibilityLabel={isFav ? t('unfavorite') : t('favorite')} style={styles.round}>
            <Heart color={isFav ? colors.favorite : colors.text} fill={isFav ? colors.favorite : 'transparent'} />
          </LiquidGlassSurface>
          <LiquidGlassSurface radius={999} onPress={busy ? undefined : () => downloadWallpaper(w)} accessibilityLabel={t('download')} tint={colors.accentSoft} borderOpacity={0.9} style={styles.dl}>
            <Download color={colors.accent} /><Text style={{ color: colors.accent, fontWeight: '700', fontSize: 16 }}>{t('download')}</Text>
          </LiquidGlassSurface>
        </View>
      </SafeAreaView>
      <DownloadProgressToast id={w.id} />
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg }, title: { color: colors.text, fontSize: 20, fontWeight: '700' }, meta: { color: colors.textMuted, fontSize: 14 }, link: { color: colors.accent, fontSize: 15 },
  top: { position: 'absolute', top: 0, left: 16 }, bottom: { position: 'absolute', bottom: 0, left: 16, right: 16 },
  round: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  dl: { flex: 1, height: 56, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' },
});
