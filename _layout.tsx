import React, { useEffect, useState } from 'react';
import { I18nManager, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { reloadAppAsync } from 'expo';
import { usePreferences } from '../src/store/preferencesStore';
import { useFavorites } from '../src/store/favoritesStore';
import { isRTL } from '../src/localization';
import { colors } from '../src/theme';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

/** Applies RTL/LTR. React Native needs a reload for direction to change natively; we reload once on mismatch. */
export function syncDirection(lang: 'ar' | 'en') {
  const rtl = isRTL(lang);
  if (I18nManager.isRTL !== rtl) { I18nManager.allowRTL(rtl); I18nManager.forceRTL(rtl); return true; }
  return false;
}

export default function RootLayout() {
  const lang = usePreferences((s) => s.language);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const done = () => setReady(true);
    const hydrated = usePreferences.persist.hasHydrated() && useFavorites.persist.hasHydrated();
    if (hydrated) done();
    const a = usePreferences.persist.onFinishHydration(() => { if (useFavorites.persist.hasHydrated()) done(); });
    const b = useFavorites.persist.onFinishHydration(() => { if (usePreferences.persist.hasHydrated()) done(); });
    return () => { a(); b(); };
  }, []);
  useEffect(() => { if (ready && syncDirection(lang)) reloadAppAsync().catch(() => {}); }, [ready, lang]);
  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'fade' }} />
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
