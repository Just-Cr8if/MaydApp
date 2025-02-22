import React, { useEffect, useRef } from 'react';
import { Animated, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';
import { Colors } from '../../styles/Constants';

const PulsatingButton = ({ onPress, imageSource }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View
        style={[
          styles.displayTableOrderButton,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Image
          source={imageSource}
          style={[{ width: 35, height: 35 }]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  displayTableOrderButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10001,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightModeLightGrey,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 8,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default PulsatingButton;