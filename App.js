import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { OrdersProvider } from './src/context/OrdersContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { ToastProvider } from './src/components/ToastNotification';
import MainNavigator from './src/navigation/MainNavigator';
import SplashScreen from './src/screens/SplashScreen';
import LocationScreen from './src/screens/LocationScreen';

/**
 * Hafsum Coffee App - Main Entry Point
 * Flow: Splash → Location Picker → Main App
 */
export default function App() {
  const [appStage, setAppStage] = useState('splash'); // 'splash' | 'location' | 'app'
  const [selectedLocation, setSelectedLocation] = useState(null);

  // 1. Splash Screen
  if (appStage === 'splash') {
    return (
      <SafeAreaProvider>
        <SplashScreen onFinish={() => setAppStage('location')} />
      </SafeAreaProvider>
    );
  }

  // 2. Location Picker
  if (appStage === 'location') {
    return (
      <SafeAreaProvider>
        <LocationScreen
          onFinish={(loc) => {
            setSelectedLocation(loc);
            setAppStage('app');
          }}
        />
      </SafeAreaProvider>
    );
  }

  // 3. Main App
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <FavoritesProvider>
            <OrdersProvider>
              <CartProvider>
                <ToastProvider>
                  <NavigationContainer>
                    <MainNavigator selectedLocation={selectedLocation} />
                  </NavigationContainer>
                </ToastProvider>
              </CartProvider>
            </OrdersProvider>
          </FavoritesProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
