import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native';

// Import screens
import InitialScreen from '../screens/InitialScreen';
import DriverHomeScreen from '../screens/driverScreens/DriverHomeScreen';
import OrderDetailsScreen from '../screens/driverScreens/OrderDetailsScreen';
import DriverDetailsScreen from '../screens/driverScreens/DriverDetailsScreen';
import DriverLoginScreen from '../screens/driverScreens/DriverLoginScreen';
import DriverLogoutScreen from '../screens/driverScreens/DriverLogoutScreen';
import CameraScreen from '../screens/driverScreens/CameraScreen';

import RestaurantLoginScreen from '../screens/restaurantScreens/RestaurantLoginScreen';
import RestaurantHomeScreen from '../screens/restaurantScreens/RestaurantHomeScreen';
import RestaurantMenuItemScreen from '../screens/restaurantScreens/RestaurantMenuItemScreen';
import RestaurantOrderScreen from '../screens/restaurantScreens/RestaurantOrderScreen';
import RestaurantSettingsScreen from '../screens/restaurantScreens/RestaurantSettingsScreen';

import { useAuth } from '../context/AuthContext';
import { useRestaurantAuth } from '../context/RestaurantContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator for DriverHome and OrderDetails
const DriverHomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DriverHome"
        component={DriverHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: 'Order Details' }}
      />
    </Stack.Navigator>
  );
};

// Tab Navigator for the main driver sections
const DriverTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={DriverHomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="DriverDetails"
        component={DriverDetailsScreen}
        options={{ title: 'Details' }}
      />
      <Tab.Screen
        name="Logout"
        component={DriverLogoutScreen}
        options={{ title: 'Logout' }}
      />
    </Tab.Navigator>
  );
};

const RestaurantHomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RestaurantHome"
        component={RestaurantHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RestaurantMenuItem"
        component={RestaurantMenuItemScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const RestaurantTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={RestaurantHomeStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen
        name="Orders"
        component={RestaurantOrderScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Orders'
        }}
      />
      <Tab.Screen
        name="Settings"
        component={RestaurantSettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Logout'
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigation Component
const Navigation = () => {
  const { isLoggedIn, selectedRole, setSelectedRole } = useAuth();
  const { restaurantIsLoggedIn, restaurantIsLoggingIn } = useRestaurantAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = async role => {
    await AsyncStorage.setItem('selectedRole', role);
    setSelectedRole(role);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!selectedRole === 'Drivers' ? (
          isLoggedIn ? (
            <Stack.Screen
              name="DriverTabs"
              component={DriverTabNavigator}
              options={{
                headerShown: false,
              }}
            />
          ) : (
            <Stack.Screen
              name="DriverLogin"
              component={DriverLoginScreen}
              options={{
                headerShown: false,
              }}
            />
          )
        ) : (
          restaurantIsLoggedIn ? (
          <Stack.Screen
            name="RestaurantTabs"
            component={RestaurantTabNavigator}
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <Stack.Screen
            name="RestaurantLogin"
            component={RestaurantLoginScreen}
            options={{
              headerShown: false,
            }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;