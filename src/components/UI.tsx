import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const Row = ({children, style}: any) => (
  <View style={[styles.row, style]}>{children}</View>
);
export const Title = ({children}: any) => (
  <Text style={styles.title}>{children}</Text>
);
export const Subtitle = ({children}: any) => (
  <Text style={styles.subtitle}>{children}</Text>
);

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center'},
  title: {fontSize: 22, fontWeight: '700'},
  subtitle: {fontSize: 14, opacity: 0.7},
});
