import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../../src/store/favoritesStore';
import { useT } from '../../src/store/preferencesStore';
import { WallpaperGrid } from '../../src/components/WallpaperGrid';
import { EmptyState } from '../../src/components/EmptyState';
import { colors } from '../../src/theme';

export default function Favorites() {
  const t = useT(); const { items, order } = useFavorites();
  const list = order.map((id) => items[id]).filter(Boolean);
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      {list.length === 0 ? <EmptyState message={t('emptyFavorites')} /> :
        <WallpaperGrid items={list} loading={false} loadingMore={false} onEnd={() => {}} />}
    </SafeAreaView>
  );
}
