import React from 'react';
import { Text, View, StyleSheet, Pressable, Dimensions,
  ActivityIndicator, Platform
 } from 'react-native';

const ActionButton = (props) => {
  const { title, onPress, disabled, backgroundColor, isLoading, textColor } = props;
  const { width } = Dimensions.get('window');
  const isLargeScreen = width >= 768;

  return (
    <Pressable
      style={[styles.button]}
      onPress={disabled ? null : onPress}
      disabled={disabled}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
       )
      : (
        <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: 100,
    alignSelf: 'center',
    height: 35,
    marginBottom: 15,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 1.65,
    elevation: 2,
    backgroundColor: '#EBE8ED'
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
});
