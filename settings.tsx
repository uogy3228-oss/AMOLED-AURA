import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LiquidGlassSurface } from '../../src/components/LiquidGlassSurface';
import { usePreferences, useT } from '../../src/store/preferencesStore';
import { cacheService } from '../../src/services/cacheService';
import { activeDownloadIds } from '../../src/services/downloadService';
import { colors } from '../../src/theme';

export default function SettingsScreen() {
  const t = useT(); const { language, setLanguage } = usePreferences(); const [busy, setBusy] = useState(false);
  const clear = () => Alert.alert(t('clearCache'), t('clearCacheConfirm'), [
    { text: t('cancel'), style: 'cancel' },
    { text: t('confirm'), onPress: async () => {
      setBusy(true);
      try { await cacheService.clearAll(activeDownloadIds()); Alert.alert(t('cacheCleared')); }
      catch { Alert.alert(t('cacheFailed')); } finally { setBusy(false); }
    } },
  ]);
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 140 }}>
        <LiquidGlassSurface style={styles.card}>
          <Text style={styles.title}>{t('language')}</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {(['ar', 'en'] as const).map((l) => (
              <LiquidGlassSurface key={l} radius={16} onPress={() => setLanguage(l)} accessibilityState={{ selected: language === l }}
                tint={language === l ? colors.accentSoft : 'rgba(255,255,255,0.05)'} borderOpacity={language === l ? 0.9 : 0.2} shadow={false} style={styles.opt}>
                <Text style={[styles.optText, language === l && { color: colors.accent }]}>{t(l === 'ar' ? 'arabic' : 'english')}</Text>
              </LiquidGlassSurface>
            ))}
          </View>
          <Text style={styles.note}>{t('restartNote')}</Text>
        </LiquidGlassSurface>
        <LiquidGlassSurface style={styles.card} onPress={busy ? undefined : clear} accessibilityLabel={t('clearCache')}>
          <Text style={styles.title}>{t('clearCache')}</Text>
        </LiquidGlassSurface>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  card: { padding: 18, gap: 14 }, title: { color: colors.text, fontSize: 17, fontWeight: '700' },
  opt: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center' }, optText: { color: colors.text, fontSize: 16 }, note: { color: colors.textMuted, fontSize: 13 },
});
