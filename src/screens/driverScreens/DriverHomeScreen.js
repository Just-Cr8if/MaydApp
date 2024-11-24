import React from 'react';
import { View, Text, Button } from 'react-native';

const DriverHomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>DriverHomeScreen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('DriverDetails')}
      />
    </View>
  );
};

export default DriverHomeScreen;