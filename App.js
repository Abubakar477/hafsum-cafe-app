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

/**
 * Hafsum Coffee App - Main Entry Point
 */
export default function App() {
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  // Show Splash Screen first
  if (!isSplashFinished) {
    return (
      <SplashScreen onFinish={() => setIsSplashFinished(true)} />
    );
  }

  // Main App content with all necessary global states
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <FavoritesProvider>
            <OrdersProvider>
              <CartProvider>
                <ToastProvider>
                  <NavigationContainer>
                    <MainNavigator />
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
