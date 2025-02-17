import React from 'react';
import { Text, View, StyleSheet, Pressable, Dimensions,
  ActivityIndicator
 } from 'react-native';

const Button = (props) => {
  const { title, onPress, disabled, alternateColor, isLoading } = props;
  const { width } = Dimensions.get('window');
  const isLargeScreen = width >= 768;

  return (
    <Pressable
      style={[
        styles.button,
        disabled ? styles.buttonDisabled : {}
      , { backgroundColor: disabled ? 'grey' : alternateColor ? alternateColor : '#00A6FF' }]}
      onPress={disabled ? null : onPress}
      disabled={disabled}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
       )
      : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 3,
    width: 150,
    alignSelf: 'center',
    height: 40,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
