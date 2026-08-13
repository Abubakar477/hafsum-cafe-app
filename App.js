// ─── App.js ───────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { CartProvider } from './src/context/CartContext';
import { AuthProvider } from './src/context/AuthContext';
import { OrdersProvider } from './src/context/OrdersContext';
import SplashScreen from './src/screens/SplashScreen';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="light" />
        <SplashScreen onFinish={() => setSplashDone(true)} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <CartProvider>
          <OrdersProvider>
            <NavigationContainer>
              <StatusBar style="light" />
              <MainNavigator />
            </NavigationContainer>
          </OrdersProvider>
        </CartProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
