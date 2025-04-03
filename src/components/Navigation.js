import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Text } from 'react-native';

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
import RestaurantMenuScreen from '../screens/restaurantScreens/RestaurantMenuScreen';
import RestaurantOrderScreen from '../screens/restaurantScreens/RestaurantOrderScreen';
import RestaurantSettingsScreen from '../screens/restaurantScreens/RestaurantSettingsScreen';
import ManageTableOrderScreen from '../screens/restaurantScreens/ManageTableOrderScreen';
import TablesScreen from '../screens/restaurantScreens/paymentsScreens/TablesScreen';
import TableOrdersScreen from '../screens/restaurantScreens/paymentsScreens/TableOrderScreen';
import PaymentScreen from '../screens/restaurantScreens/paymentsScreens/PaymentScreen';

import AppPhotosScreen from '../screens/restaurantScreens/settingsScreens/AppPhotosScreen';
import ContactSupportScreen from '../screens/restaurantScreens/settingsScreens/ContactSupportScreen';
import HoursOfOperationsScreen from '../screens/restaurantScreens/settingsScreens/HoursOfOperationsScreen';
import SubscriptionScreen from '../screens/restaurantScreens/settingsScreens/SubscriptionScreen';
import VenueInfoScreen from '../screens/restaurantScreens/settingsScreens/VenueInfoScreen';

import { useAuth } from '../context/AuthContext';
import { useRestaurantAuth } from '../context/RestaurantContext';
import { useStripeTerminal } from '@stripe/stripe-terminal-react-native';

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
        name="RestaurantMenu"
        component={RestaurantMenuScreen}
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

const RestaurantOrderStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RestaurantOrders"
        component={RestaurantOrderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageTableOrder"
        component={ManageTableOrderScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const RestaurantPaymentStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tables"
        component={TablesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TableOrders"
        component={TableOrdersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const RestaurantSettingsStackNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="RestaurantSettings">
          <Stack.Screen name="RestaurantSettings" component={RestaurantSettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AppPhotos" component={AppPhotosScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="ContactSupport" component={ContactSupportScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="HoursOfOperation" component={HoursOfOperationsScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="VenueInformation" component={VenueInfoScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
  );
};

const RestaurantTabNavigator = () => {
  const { teamMemberRole } = useRestaurantAuth();

  return (
    <Tab.Navigator>
      {!teamMemberRole && (
        <Tab.Screen
          name="Menus"
          component={RestaurantHomeStackNavigator}
          options={{
            headerShown: false,
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? '#00A6FF' : 'black',
                  fontSize: 12,
                }}
              >
                Menus
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <Image 
                source={
                  focused 
                    ? require('../images/menu-tab-icon-blue.png') 
                    : require('../images/menu-tab-icon-black.png')
                }  
                style={{ width: 25, height: 25 }}
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Orders"
        component={RestaurantOrderStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? '#00A6FF' : 'black',
                fontSize: 12,
              }}
            >
              Orders
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image 
              source={
                focused 
                  ? require('../images/order-tab-icon-blue.png') 
                  : require('../images/order-tab-icon-black.png')
              }  
              style={{ width: 25, height: 25 }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Payments"
        component={RestaurantPaymentStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? '#00A6FF' : 'black',
                fontSize: 12,
              }}
            >
              Payments
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image 
              source={
                focused 
                  ? require('../images/payments-icon-blue.png') 
                  : require('../images/payments-icon-black.png')
              }  
              style={{ width: 25, height: 25 }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={RestaurantSettingsStackNavigator}
        options={{
          headerShown: false,
          title: 'Settings',
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? '#00A6FF' : 'black',
                fontSize: 12,
              }}
            >
              Settings
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image 
              source={
                focused 
                  ? require('../images/settings-blue.png') 
                  : require('../images/settings-black.png')
              }  
              style={{ width: 25, height: 25 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigation Component
const Navigation = () => {
  const { isLoggedIn, selectedRole, setSelectedRole } = useAuth();
  const { restaurantIsLoggedIn, teamMemberRole } = useRestaurantAuth();

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