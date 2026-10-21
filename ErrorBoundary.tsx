import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../theme';
import { translate } from '../localization';
import { usePreferences } from '../store/preferencesStore';
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    const lang = usePreferences.getState().language;
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <Text style={{ color: colors.text, textAlign: 'center' }}>{translate(lang, 'errorGeneric')}</Text>
        <Pressable onPress={() => this.setState({ failed: false })} style={{ padding: 14 }}><Text style={{ color: colors.accent, fontWeight: '700' }}>{translate(lang, 'retry')}</Text></Pressable>
      </View>
    );
  }
}
