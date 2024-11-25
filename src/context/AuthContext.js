import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { PEGASUS_API_BASE_URL, MOBYLMENU_API_BASE_URL,
  ORS_MOBYLMENU_ROUTING_API_KEY } from '../config';

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
    const { batched_order_id } = pegasusResponse.data;

    if (!batched_order_id) {
      throw new Error('No active batched order found for this driver.');
    }

    // Step 2: Fetch the batched order details from MobylMenu
    const mobylmenuResponse = await axios.get(`${MOBYLMENU_API_BASE_URL}/batched_order/${batched_order_id}/`);
    return mobylmenuResponse.data;
  } catch (error) {
    console.error('Error fetching driver batched order:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Unable to fetch the driver batched order.');
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
       }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);