// PageElements.js
import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Spacing, Colors } from '../../styles/Constants';

export const PageContainer = ({ children, style, ...props }) => {
  return (
    <SafeAreaView style={[styles.container, style]} {...props}>
      {children}
    </SafeAreaView>
  );
};

export const PageBody = ({ children, style, ...props }) => {
  return (
    <View style={[styles.body, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  body: {
    flex: 1,
    padding: Spacing.medium,
    backgroundColor: Colors.white,
  },
});