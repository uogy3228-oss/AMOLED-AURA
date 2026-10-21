import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallpaperSearch } from '../hooks/useWallpaperSearch';
import { GlassSearchBar } from './GlassSearchBar';
import { GlassCategoryChip } from './GlassCategoryChip';
import { WallpaperGrid } from './WallpaperGrid';
import { EmptyState } from './EmptyState';
import { CATEGORIES } from '../utils/categories';
import { useT } from '../store/preferencesStore';
import { colors } from '../theme';

export function DiscoverView() {
  const t = useT(); const s = useWallpaperSearch();
  const header = (
    <View style={{ gap: 14, marginBottom: 16 }}>
      <GlassSearchBar value={s.query} onChange={s.setQuery} onSubmit={s.submit} loading={s.loading || s.loadingMore} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }} keyboardShouldPersistTaps="handled">
        {CATEGORIES.map((c) => <GlassCategoryChip key={c} label={t(`cat_${c}` as any)} active={s.category === c} onPress={() => s.setCategory(c)} />)}
      </ScrollView>
    </View>
  );
  const footer = s.error ? <EmptyState message={t('errorGeneric')} actionLabel={t('retry')} onAction={s.retry} />
    : !s.loading && s.items.length === 0 ? <EmptyState message={t('emptyResults')} /> : null;
  return (
    <SafeAreaView edges={['top']} style={styles.root}>
      <WallpaperGrid items={s.items} loading={s.loading && s.items.length === 0} loadingMore={s.loadingMore} onEnd={s.loadMore} header={header} onRefresh={s.retry} footer={footer} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.bg } });
