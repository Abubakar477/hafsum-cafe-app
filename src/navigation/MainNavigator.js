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
import { Colors } from '../theme';

const Tab = createBottomTabNavigator();

function CartIcon({ color, focused }) {
  const { itemCount } = useCart();
  return (
    <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={focused ? 'bag' : 'bag-outline'} size={24} color={color} />
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
        tabBarActiveTintColor: Colors.primary, // Brand color for active tab
        tabBarInactiveTintColor: '#8E8E93',    // Standard grey for inactive
        tabBarStyle: {
          backgroundColor: '#FFFFFF',          // Pure white background like the 2nd screenshot
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',           // Thin subtle border on top
          height: Platform.OS === 'ios' ? 88 : 64 + insets.bottom, // Adjusted height for clear visibility
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8 + insets.bottom,
          paddingTop: 8,
          elevation: 10,                       // Standard shadow for Android
          shadowColor: '#000',                 // Shadow for iOS
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          if (route.name === 'Cart') {
            return <CartIcon color={color} focused={focused} />;
          }
          let iconName;
          if (route.name === 'Home')         iconName = focused ? 'home'        : 'home-outline';
          else if (route.name === 'Menu')    iconName = focused ? 'restaurant'  : 'restaurant-outline';
          else if (route.name === 'Orders')  iconName = focused ? 'receipt'     : 'receipt-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person'      : 'person-outline';
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
  tabLabel: {
    fontSize: 11,
    fontWeight: '700', // Bold labels for clarity
    marginBottom: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#e8445a',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF', // White border for badge on white background
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
});
