import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native';

// Import screens
import InitialScreen from '../screens/InitialScreen';
import DriverHomeScreen from '../screens/driverScreens/DriverHomeScreen';
import DriverDetailsScreen from '../screens/driverScreens/DriverDetailsScreen';
import DriverLoginScreen from '../screens/driverScreens/DriverLoginScreen';
import DriverLogoutScreen from '../screens/driverScreens/DriverLogoutScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const DriverTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={DriverHomeScreen} />
      <Tab.Screen name="Details" component={DriverDetailsScreen} />
      <Tab.Screen name="Logout" component={DriverLogoutScreen} />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const { isLoggedIn } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const savedRole = await AsyncStorage.getItem('selectedRole');
      if (savedRole) setSelectedRole(savedRole);
      setIsLoading(false);
    };

    fetchRole();
  }, []);

  const handleSelectRole = async role => {
    await AsyncStorage.setItem('selectedRole', role);
    setSelectedRole(role);
  };

  const handleResetRole = async () => {
    await AsyncStorage.removeItem('selectedRole');
    setSelectedRole(null);
  };

  if (isLoading) {
    return null; // Add a SplashScreen component if desired
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!selectedRole ? (
          <Stack.Screen name="Initial" options={{ headerShown: false }}>
            {props => (
              <InitialScreen {...props} onSelectRole={handleSelectRole} />
            )}
          </Stack.Screen>
        ) : selectedRole === 'Drivers' ? (
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
                title: 'Driver Login',
                headerLeft: () => (
                  <Button title="Back" onPress={handleResetRole} />
                ),
              }}
            />
          )
        ) : (
          <Stack.Screen
            name="RestaurantsPlaceholder"
            component={() => null} // Replace with actual screens later
            options={{
              title: 'Restaurants',
              headerLeft: () => (
                <Button title="Back" onPress={handleResetRole} />
              ),
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;