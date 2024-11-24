import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback
 } from 'react-native';
import LargeButton from '../components/buttons/LargeButton';

const InitialScreen = ({ onSelectRole }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project Pegasus</Text>
      <Text style={styles.subTitle}>Powered By MobylMenu</Text>
      <View style={styles.buttonContainer}>
        <LargeButton
            title="Drivers"
            onPress={() => onSelectRole('Drivers')}
        />
        <View style={{ height: 20 }}></View>
        <LargeButton
            title="Restaurants"
            onPress={() => onSelectRole('Restaurants')}
            alternateColor="#28a745"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  buttonContainer: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    color: '#343a40',
  },
  subTitle: {
    marginBottom: 50
  }
});

export default InitialScreen;