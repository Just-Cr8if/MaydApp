import React from 'react';
import Navigation from './src/components/Navigation';
import { AuthProvider } from './src/context/AuthContext';
import { RestaurantProvider } from './src/context/RestaurantContext';

export default function App() {
  return (
    <RestaurantProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </RestaurantProvider>
  );
}
