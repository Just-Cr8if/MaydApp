import React from 'react';
import { Text, View, StyleSheet, Pressable, Dimensions,
  ActivityIndicator
 } from 'react-native';

const LargeButton = (props) => {
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

export default LargeButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 3,
    width: '90%',
    alignSelf: 'center',
    height: 60,
    marginTop: 5
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
