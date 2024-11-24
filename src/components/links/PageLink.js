import React from 'react';
import { Text, View, StyleSheet, Pressable, Dimensions,
  ActivityIndicator
 } from 'react-native';

const PageLink = (props) => {
  const { title, onPress, disabled, alternateColor, isLoading } = props;
  const { width } = Dimensions.get('window');
  const isLargeScreen = width >= 768;

  return (
    <Pressable
      style={styles.link}
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

export default PageLink;

const styles = StyleSheet.create({
    link: {
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 3,
    width: '100%',
    height: 50,
    marginTop: 5,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
});
