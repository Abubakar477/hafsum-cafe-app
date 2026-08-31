// ─── MainNavigator.js ─────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { StyleSheet, Platform, View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import { useCart } from '../context/CartContext';
import { Colors } from '../theme';
import DrawerMenu from '../components/DrawerMenu';

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

// ─── Hamburger Button (top-left of each screen header) ──────────────────────
function HamburgerButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.hamburger} activeOpacity={0.75}>
      <Ionicons name="menu" size={26} color={Colors.white} />
    </TouchableOpacity>
  );
}

export default function MainNavigator({ selectedLocation }) {
  const insets = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route, navigation }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#F0F0F0',
            height: Platform.OS === 'ios' ? 88 : 64 + insets.bottom,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8 + insets.bottom,
            paddingTop: 8,
            elevation: 10,
            shadowColor: '#000',
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
            if (route.name === 'Home')        iconName = focused ? 'home'       : 'home-outline';
            else if (route.name === 'Menu')   iconName = focused ? 'restaurant' : 'restaurant-outline';
            else if (route.name === 'Orders') iconName = focused ? 'receipt'    : 'receipt-outline';
            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          options={({ navigation }) => ({
            tabBarLabel: 'Home',
            // Pass drawer opener into HomeScreen via navigation params
            tabBarButton: (props) => (
              <TouchableOpacity {...props} />
            ),
          })}
        >
          {(props) => <HomeScreen {...props} onOpenDrawer={() => setDrawerOpen(true)} selectedLocation={selectedLocation} />}
        </Tab.Screen>

        <Tab.Screen
          name="Menu"
          options={{ tabBarLabel: 'Menu' }}
        >
          {(props) => <MenuScreen {...props} onOpenDrawer={() => setDrawerOpen(true)} />}
        </Tab.Screen>

        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{ tabBarLabel: 'Cart' }}
        />

        <Tab.Screen
          name="Orders"
          component={OrdersScreen}
          options={{ tabBarLabel: 'My Orders' }}
        />
      </Tab.Navigator>

      {/* Global Left Drawer */}
      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navigation={null}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
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
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  hamburger: {
    padding: 4,
  },
});
