import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Linking, Pressable, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Download, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { LiquidGlassSurface } from './LiquidGlassSurface';
import { useDownloads } from '../services/downloadService';
import { useT } from '../store/preferencesStore';
import { colors } from '../theme';

export function DownloadProgressToast({ id }: { id: string }) {
  const job = useDownloads((s) => s.jobs[id]); const dismiss = useDownloads((s) => s.dismiss); const t = useT(); const insets = useSafeAreaInsets();
  useEffect(() => {
    if (job?.status === 'success') { const x = setTimeout(() => dismiss(id), 2500); return () => clearTimeout(x); }
  }, [job?.status, id, dismiss]);
  if (!job || job.status === 'idle') return null;
  const busy = job.status === 'downloading' || job.status === 'saving';
  const label = { downloading: t('downloading'), saving: t('saving'), success: t('saved'), error: t('downloadFailed'), 'permission-denied': t('permissionDenied'), idle: '' }[job.status];
  const pct = job.status === 'downloading' && job.progress != null ? Math.round(job.progress * 100) : null;
  return (
    <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={[styles.wrap, { bottom: insets.bottom + 96 }]} accessibilityLiveRegion="polite">
      <LiquidGlassSurface radius={22} style={styles.inner}>
        <View style={styles.row}>
          {job.status === 'success' ? <CheckCircle2 color={colors.accent} /> : job.status === 'error' || job.status === 'permission-denied' ? <AlertCircle color={colors.danger} /> : <Download color={colors.accent} />}
          <Text style={styles.text}>{label}{pct != null ? `  ${pct}%` : ''}</Text>
          {busy && pct == null ? <ActivityIndicator color={colors.accent} /> : null}
          {job.status === 'permission-denied' ? <Pressable onPress={() => Linking.openSettings()} hitSlop={10}><Text style={styles.link}>{t('openSettings')}</Text></Pressable> : null}
          {(job.status === 'error' || job.status === 'permission-denied') ? <Pressable onPress={() => dismiss(id)} hitSlop={10}><Text style={styles.link}>✕</Text></Pressable> : null}
        </View>
        {job.status === 'downloading' && pct != null ? <View style={styles.bar}><View style={[styles.fill, { width: `${pct}%` }]} /></View> : null}
      </LiquidGlassSurface>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16 }, inner: { padding: 16, gap: 10 }, row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  text: { color: colors.text, flex: 1, fontSize: 15 }, link: { color: colors.accent, fontWeight: '700' },
  bar: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden' }, fill: { height: 4, backgroundColor: colors.accent },
});
