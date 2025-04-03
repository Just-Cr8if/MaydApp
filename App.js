import React from 'react';
import Navigation from './src/components/Navigation';
import { AuthProvider } from './src/context/AuthContext';
import { RestaurantProvider } from './src/context/RestaurantContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StripeTerminalProvider } from './src/context/StripeTerminalContext';
import { StripeTerminalProvider as StripeNativeTerminalProvider } from '@stripe/stripe-terminal-react-native';
import { useRestaurantAuth } from './src/context/RestaurantContext';

const AppWithStripe = () => {
  const { fetchConnectionToken } = useRestaurantAuth();

  return (
    <StripeNativeTerminalProvider tokenProvider={fetchConnectionToken} logLevel="verbose"> 
      <StripeTerminalProvider>
        <Navigation />
      </StripeTerminalProvider>
    </StripeNativeTerminalProvider>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RestaurantProvider>
        <AuthProvider>
          <AppWithStripe />
        </AuthProvider>
      </RestaurantProvider>
    </GestureHandlerRootView>
  );
}

