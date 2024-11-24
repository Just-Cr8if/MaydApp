import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import LargeButton from '../../components/buttons/LargeButton';

import { baseStyles } from '../../styles/baseStyles';

const DriverLoginScreen = () => {
  const { login, selectedRole, setSelectedRole, isLoggingIn} = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      login({ username, password });
    } else {
      alert('Please enter both username and password');
    }
  };

  const handleResetRole = async () => {
    await AsyncStorage.removeItem('selectedRole');
    setSelectedRole(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Login</Text>
      <View style={styles.buttonContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername} // Update username state
          autoCapitalize="none"
          keyboardType="default"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword} // Update password state
          secureTextEntry // Hide password input
        />
        <LargeButton title="Log In" onPress={handleLogin} isLoading={isLoggingIn}/>
        <TouchableOpacity
          onPress={handleResetRole}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#343a40',
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    paddingLeft: 15,
    height: 50,
    width: '90%',
    fontSize: 18,
  },
  backButton: {
    marginTop: 15,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    padding: 10,
    width: 100,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DriverLoginScreen;