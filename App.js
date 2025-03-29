import React from 'react';
import Bugsnag from '@bugsnag/expo';
import Navigation from './src/components/Navigation';
import { AuthProvider } from './src/context/AuthContext';
import { RestaurantProvider } from './src/context/RestaurantContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

Bugsnag.start({
  apiKey: 'eb7d47c970591295bfa8bbb7eae35d13',
  appVersion: '1.1.1',
  releaseStage: 'production',
});

// Get the React error boundary from Bugsnag
const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RestaurantProvider>
          <AuthProvider>
            <Navigation />
          </AuthProvider>
        </RestaurantProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}