import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { COLORS } from './src/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <RootNavigator />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
