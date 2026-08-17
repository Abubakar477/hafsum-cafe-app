// ─── MainNavigator.js ─────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Platform, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator();

function CartIcon({ color, focused }) {
  const { itemCount } = useCart();
  return (
    <View style={{ width: 40, height: 32, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={focused ? 'bag' : 'bag-outline'} size={30} color={color} />
      {itemCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
        </View>
      )}
    </View>
  );
}

export default function MainNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#000000', // Active tab color set to Black
        tabBarInactiveTintColor: '#FFFFFF', // Inactive tab color remains Pure White
        tabBarStyle: {
          backgroundColor: '#492760',
          // Move navigation bar upward above system gestures/buttons responsively
          // Strictly respecting safe area insets to adapt to all Android devices and aspect ratios
          height: (Platform.OS === 'ios' ? 95 : 85) + insets.bottom,
          paddingBottom: insets.bottom + 20, 
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '900', // Maintaining existing bold styling
          marginBottom: 0,
        },
        tabBarIcon: ({ focused, color }) => {
          if (route.name === 'Cart') {
            return <CartIcon color={color} focused={focused} />;
          }
          let iconName;
          if (route.name === 'Home')         iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Menu')    iconName = focused ? 'restaurant' : 'restaurant-outline';
          else if (route.name === 'Orders')  iconName = focused ? 'receipt' : 'receipt-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          
          return <Ionicons name={iconName} size={30} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Menu"    component={MenuScreen} options={{ tabBarLabel: 'Menu' }} />
      <Tab.Screen name="Cart"    component={CartScreen} options={{ tabBarLabel: 'Cart' }} />
      <Tab.Screen name="Orders"  component={OrdersScreen} options={{ tabBarLabel: 'My Orders' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    borderWidth: 1.5,
    borderColor: '#492760',
    zIndex: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
});
