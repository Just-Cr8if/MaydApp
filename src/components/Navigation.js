import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/LoginScreen'; // Add a login screen
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

const Navigation = () => {
  const { isLoggedIn } = useAuth(); // Get login state from context

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          // Protected routes (accessible only when logged in)
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
          </>
        ) : (
          // Public route (login screen)
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
