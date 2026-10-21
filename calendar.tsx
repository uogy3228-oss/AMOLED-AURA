import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { LiquidGlassSurface } from '../../src/components/LiquidGlassSurface';
import { EmptyState } from '../../src/components/EmptyState';
import { searchWallpapers } from '../../src/services/wikimediaApi';
import { pickDaily } from '../../src/utils/daily';
import { rememberWallpaper } from '../../src/utils/memory';
import { dateLocale } from '../../src/localization';
import { usePreferences, useT } from '../../src/store/preferencesStore';
import type { Wallpaper } from '../../src/types';
import { colors } from '../../src/theme';

export default function CalendarScreen() {
  const t = useT(); const lang = usePreferences((s) => s.language); const router = useRouter();
  const [date, setDate] = useState(() => new Date()); const [catalog, setCatalog] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  const load = async () => {
    setLoading(true); setError(false);
    try { const p = await searchWallpapers('', 'nature', lang); setCatalog(p.items); } catch { setError(true); } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [lang]);
  const item = useMemo(() => pickDaily(catalog, date), [catalog, date]);
  const shift = (d: number) => setDate((x) => { const n = new Date(x); n.setDate(n.getDate() + d); return n; });
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
      <LiquidGlassSurface radius={999} style={styles.picker}>
        <Pressable onPress={() => shift(-1)} accessibilityLabel={t('previousDay')} style={styles.arrow}><ChevronLeft color={colors.accent} /></Pressable>
        <Text style={styles.date}>{date.toLocaleDateString(dateLocale(lang), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
        <Pressable onPress={() => shift(1)} accessibilityLabel={t('nextDay')} style={styles.arrow}><ChevronRight color={colors.accent} /></Pressable>
      </LiquidGlassSurface>
      <Text style={styles.heading}>{t('dailyWallpaper')}</Text>
      {loading ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} /> : error ? <EmptyState message={t('errorGeneric')} actionLabel={t('retry')} onAction={load} />
        : item ? (
          <Pressable style={styles.hero} onPress={() => { rememberWallpaper(item); router.push(`/wallpaper/${item.id}`); }} accessibilityLabel={item.title}>
            <Image source={{ uri: item.thumbUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          </Pressable>) : <EmptyState message={t('emptyResults')} />}
      {item ? <Text style={styles.note} numberOfLines={2}>{item.title} · {t('dailyNote')}</Text> : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  picker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 }, arrow: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  date: { color: colors.text, fontWeight: '600', flexShrink: 1, textAlign: 'center' }, heading: { color: colors.text, fontSize: 20, fontWeight: '700', marginVertical: 14 },
  hero: { flex: 1, maxHeight: 520, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 100 },
  note: { position: 'absolute', bottom: 110, left: 24, right: 24, color: colors.textMuted, fontSize: 12, textAlign: 'center' },
});
