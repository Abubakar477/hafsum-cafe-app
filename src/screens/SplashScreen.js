// ─── Splash Screen ────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';

import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';

import { Colors } from '../theme';


// ─────────────────────────────────────────────────────────────────────────────
// SPLASH IMAGE
// ─────────────────────────────────────────────────────────────────────────────

const splashImage = require('../../assets/images/hafsum_splash.jpg');


// ─────────────────────────────────────────────────────────────────────────────
// SPLASH SCREEN
// ─────────────────────────────────────────────────────────────────────────────

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    let mounted = true;

    // Fade In
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    // After 2 seconds, fade out and finish
    const timer = setTimeout(() => {
      if (!mounted) return;

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      const finishTimer = setTimeout(() => {
        if (!mounted) return;
        if (typeof onFinishRef.current === 'function') {
          onFinishRef.current();
        }
      }, 400);

      return () => clearTimeout(finishTimer);
    }, 2000);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [fadeAnim]);


  // ───────────────────────────────────────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────────────────────────────────────

  return (

    <View style={styles.container}>

      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors?.primary || '#492760'}
        hidden={true}
      />


      <Animated.Image
        source={splashImage}
        style={[
          styles.image,
          {
            opacity: fadeAnim,
          },
        ]}
        resizeMode="cover"
      />

    </View>

  );

}


// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

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