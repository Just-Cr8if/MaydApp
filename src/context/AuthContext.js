import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { PEGASUS_API_BASE_URL, MOBYLMENU_API_BASE_URL,
  ORS_MOBYLMENU_ROUTING_API_KEY } from '../config';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [driverInfo, setDriverInfo] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Fetch driverInfo from AsyncStorage
        const storedDriverInfo = await AsyncStorage.getItem('driverInfo');
        if (storedDriverInfo) {
          const parsedDriverInfo = JSON.parse(storedDriverInfo);
          const savedRole = await AsyncStorage.getItem('selectedRole');
          if (savedRole) setSelectedRole(savedRole);
          if (parsedDriverInfo.token) {
            setDriverInfo(parsedDriverInfo);
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initializeAuth();
  }, []);

  const login = async ({ username, password }) => {
    setIsLoggingIn(true);
    try {
      const response = await axios.post(`${PEGASUS_API_BASE_URL}/login_driver/`, {
        username,
        password,
      });

      if (response.status === 200) {
        const driverData = response.data;
        setDriverInfo(driverData);

        await AsyncStorage.setItem('driverInfo', JSON.stringify(driverData));
        setIsLoggedIn(true);
      } else {
        alert('Invalid login credentials');
      }
      setIsLoggingIn(false);
    } catch (error) {
      console.error('Login error:', error);
      setIsLoggingIn(false);
      alert('Incorrect username/password pair. Please check your credentials and try again.');
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setDriverInfo(null);

    await AsyncStorage.removeItem('driverInfo');
    await AsyncStorage.removeItem('selectedRole');
  };

  // Function to fetch batched orders for hubs
const fetchBatchedOrders = async (hubIds) => {
  try {
    // Convert hub IDs array to a comma-separated string
    const query = hubIds ? `?hub_ids=${hubIds.join(',')}` : '';
    const response = await axios.get(`${MOBYLMENU_API_BASE_URL}/hubs/batched_orders/${query}`);

    return response.data;
  } catch (error) {
    console.error('Error fetching batched orders:', error);
    throw error; // Propagate the error for handling
  }
};

const createDriverBatchedOrder = async (driverId, batchedOrderId, networkHubId, status) => {
  try {
    // Construct the data object
    const data = {
      driver_id: driverId,
      batched_order_id: batchedOrderId,
      network_hub_id: networkHubId,
      status,
    };

    // Make the API call
    const response = await axios.post(`${PEGASUS_API_BASE_URL}/create_driver_batched_order/`, data);

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data.error || 'Failed to create order.');
    } else {
      // Network or other error
      throw new Error('Network error. Please try again.');
    }
  }
};


const fetchDriverBatchedOrder = async (driverId) => {
  try {
    // Step 1: Fetch the active order for the driver from Pegasus
    const pegasusResponse = await axios.get(`${PEGASUS_API_BASE_URL}/driver_active_order/${driverId}/`);
    print('PEGASUS', pegasusResponse);
    
    const { batched_order_id } = pegasusResponse.data;

    print('BATCHEDID', batched_order_id);

    if (!batched_order_id) {
      return
    }

    // Step 2: Fetch the batched order details from MobylMenu
    const mobylmenuResponse = await axios.get(`${MOBYLMENU_API_BASE_URL}/batched_order/${batched_order_id}/`);
    return mobylmenuResponse.data;
  } catch (error) {
    return null
    console.error('Error fetching driver batched order:', error.response?.data || error.message);
  }
};


// Function to upload a delivery photo and associate it with orders
const uploadDeliveryPhoto = async (photoUri, driverId, orderIds) => {
  try {
    // Create a FormData object to handle file uploads
    const formData = new FormData();
    formData.append('photo', {
      uri: photoUri,
      name: `delivery_photo${driverId}.jpg`,
      type: 'image/jpeg',
    });
    formData.append('driver_id', driverId); // Add driver ID
    orderIds.forEach(orderId => formData.append('orders', orderId)); // Add associated order IDs

    // Send the POST request
    const response = await axios.post(
      `${MOBYLMENU_API_BASE_URL}/delivery_photo/upload/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    // Return the response data
    return response.data;
  } catch (error) {
    console.error('Error uploading delivery photo:', error);
    throw error; // Propagate the error for handling
  }
};

const registerForPushNotificationsAsync = async () => {
  let token;

  // Check if the app is running on a physical device
  if (Device.isDevice) {
    // Get the current notification permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not already granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Handle permission denial
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notifications!');
      return null;
    }

    // Get the Expo push token
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: 'f80cd51c-a83f-416c-9713-278a4bd014c4', // Replace with your actual Expo project ID
      })
    ).data;
  } else {
    alert('Must use a physical device for Push Notifications');
    return null;
  }

  // Set notification channel for Android
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};

const initializePushNotifications = async () => {
  const expoPushToken = await registerForPushNotificationsAsync();

  if (expoPushToken) {
    // Update driverInfo with the push token
    const updatedDriverInfo = { ...driverInfo, expoPushToken };
    setDriverInfo(updatedDriverInfo);

    // Save updated driverInfo to AsyncStorage
    await AsyncStorage.setItem('driverInfo', JSON.stringify(updatedDriverInfo));

    // Send the push token to the backend
    await fetch(`${PEGASUS_API_BASE_URL}/drivers/update_profile/${driverInfo.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expo_push_token: expoPushToken }),
    });
  }
};

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      isLoggingIn,
      driverInfo,
      selectedRole,
      setSelectedRole,
      login, 
      logout,
      fetchBatchedOrders,
      createDriverBatchedOrder,
      fetchDriverBatchedOrder,
      uploadDeliveryPhoto,
      initializePushNotifications
       }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);