import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { OrdersProvider } from './src/context/OrdersContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { ToastProvider } from './src/components/ToastNotification';
import { registerForPushNotificationsAsync } from './src/services/notificationService';
import MainNavigator from './src/navigation/MainNavigator';
import SplashScreen from './src/screens/SplashScreen';
import LocationScreen from './src/screens/LocationScreen';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

/**
 * Hafsum Coffee App - Main Entry Point
 * Flow: Splash Screen (once) → Location Picker (Always) → Main App
 */
export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <FavoritesProvider>
            <OrdersProvider>
              <CartProvider>
                <ToastProvider>
                  <AppContent fontsLoaded={fontsLoaded} />
                </ToastProvider>
              </CartProvider>
            </OrdersProvider>
          </FavoritesProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [appStage, setAppStage] = useState('splash'); // 'splash' | 'location' | 'app'
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Register for Push Notifications & FCM when app is active
  useEffect(() => {
    if (appStage === 'app') {
      registerForPushNotificationsAsync(user?.uid).catch((err) =>
        console.log('Push notification setup error:', err?.message)
      );
    }
  }, [appStage, user?.uid]);

  // 1. Splash Screen — displays once on launch
  if (appStage === 'splash') {
    return (
      <SplashScreen
        onFinish={() => {
          setAppStage('location');
        }}
      />
    );
  }

  // 2. Location Picker — ALWAYS shown after splash
  if (appStage === 'location') {
    return (
      <LocationScreen
        onFinish={(loc) => {
          setSelectedLocation(loc);
          setAppStage('app');
        }}
      />
    );
  }

  // 3. Main App
  return (
    <NavigationContainer>
      <MainNavigator selectedLocation={selectedLocation} />
    </NavigationContainer>
  );
}
