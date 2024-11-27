import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, Button, TextInput, TouchableOpacity, Animated,
    StyleSheet, Linking, SafeAreaView, Image, Appearance, useColorScheme,
  Dimensions } from 'react-native';
import { useRestaurantAuth } from "../../context/RestaurantContext";


const RestaurantSettingsScreen = ({navigation}) => {
    const { restaurantLogout } = useRestaurantAuth();

  const handleLogout = () => {
    restaurantLogout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you sure you want to log out?</Text>
      <Button title="Log Out" onPress={handleLogout} color="red" />
      <Button title="Cancel" onPress={() => navigation.goBack()} color="gray" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
    },
    title: {
      fontSize: 20,
      marginBottom: 20,
      textAlign: 'center',
      color: '#343a40',
    },
  });

export default RestaurantSettingsScreen;