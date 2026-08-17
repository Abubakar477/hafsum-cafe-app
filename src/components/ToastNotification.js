// ─── ToastNotification.js ─────────────────────────────────────────────────────
// A global animated toast that shows when an item is added to the cart.

import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { Animated, StyleSheet, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('');
  const [icon, setIcon] = useState('checkmark-circle');
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-30)).current;
  const timer = useRef(null);

  const showToast = useCallback((msg, iconName = 'checkmark-circle') => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(msg);
    setIcon(iconName);

    // Slide in + fade in
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 20 }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    // After 2.2s, slide out + fade out
    timer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -30, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }, 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[styles.toast, { opacity, transform: [{ translateY }] }]}
      >
        <Ionicons name={icon} size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.toastText}>{message}</Text>
      </Animated.View>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#492760',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    zIndex: 9999,
    maxWidth: '85%',
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
