import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const DriverLoginScreen = () => {
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <Text>DriverLoginScreen</Text>
      <Button title="Log In" onPress={login} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DriverLoginScreen;
