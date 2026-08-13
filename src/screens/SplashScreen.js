// ─── Splash Screen ────────────────────────────────────────────────────────────
import React, { useEffect, useRef } from 'react';
import {
  View, StyleSheet, Animated, StatusBar, Platform,
} from 'react-native';
import { Colors } from '../theme';

const splashImage = require('../../assets/images/hafsum_splash.jpg');

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
      }),
      // Hold for 1.5s
      Animated.delay(1500),
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => onFinish && onFinish());
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} hidden />
      <Animated.Image
        source={splashImage}
        style={[styles.image, { opacity: fadeAnim }]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#492760',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});
