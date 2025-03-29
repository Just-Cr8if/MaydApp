import React from 'react';
import Navigation from './src/components/Navigation';
import { AuthProvider } from './src/context/AuthContext';
import { RestaurantProvider } from './src/context/RestaurantContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RestaurantProvider>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </RestaurantProvider>
    </GestureHandlerRootView>
  );
}
