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
import LoginScreen from './src/screens/LoginScreen';

/**
 * Hafsum Coffee App - Main Entry Point
 * Flow: Splash → Location Picker → Login → Main App
 */
export default function App() {
  const [appStage, setAppStage] = useState('splash'); // 'splash' | 'location' | 'login' | 'app'
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
            setAppStage('login');
          }}
        />
      </SafeAreaProvider>
    );
  }

  // 3. Login / Sign Up
  if (appStage === 'login') {
    return (
      <SafeAreaProvider>
        <AuthProvider>
          <LoginScreen
            selectedLocation={selectedLocation}
            onFinish={() => setAppStage('app')}
          />
        </AuthProvider>
      </SafeAreaProvider>
    );
  }

  // 4. Main App
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
