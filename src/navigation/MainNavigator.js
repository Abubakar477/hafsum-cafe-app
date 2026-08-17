// ─── MainNavigator.js ─────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.55)',
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
        ],
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home')    iconName = focused ? 'home'              : 'home-outline';
          else if (route.name === 'Menu')    iconName = focused ? 'restaurant'        : 'restaurant-outline';
          else if (route.name === 'Cart')    iconName = focused ? 'bag'               : 'bag-outline';
          else if (route.name === 'Orders')  iconName = focused ? 'receipt'           : 'receipt-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person'            : 'person-outline';
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen}    options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Menu"    component={MenuScreen}    options={{ tabBarLabel: 'Menu' }} />
      <Tab.Screen name="Cart"    component={CartScreen}    options={{ tabBarLabel: 'Cart' }} />
      <Tab.Screen name="Orders"  component={OrdersScreen}  options={{ tabBarLabel: 'My Orders' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#492760',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 84 : 65,
    paddingTop: 8,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
});
