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

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;


  const finishedRef = useRef(false);


  useEffect(() => {

    let mounted = true;

    // ─────────────────────────────────────────────────────────────────────────
    // FADE IN
    // ─────────────────────────────────────────────────────────────────────────

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: Platform.OS !== 'web',
    }).start();


    // ─────────────────────────────────────────────────────────────────────────
    // KEEP SPLASH VISIBLE
    // Then open main app automatically.
    //
    // IMPORTANT:
    // We do NOT depend on the animation callback anymore.
    // This makes it reliable on localhost/web as well as Android.
    // ─────────────────────────────────────────────────────────────────────────

    const timer = setTimeout(() => {

      if (!mounted || finishedRef.current) {
        return;
      }


      finishedRef.current = true;


      // ───────────────────────────────────────────────────────────────────────
      // FADE OUT
      // ───────────────────────────────────────────────────────────────────────

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }).start();


      // ───────────────────────────────────────────────────────────────────────
      // OPEN MAIN NAVIGATOR
      //
      // Small delay allows fade-out to begin before changing screen.
      // ───────────────────────────────────────────────────────────────────────

      const finishTimer = setTimeout(() => {

        if (!mounted) {
          return;
        }

        console.log(
          'Splash finished - opening MainNavigator'
        );


        if (typeof onFinish === 'function') {
          onFinish();
        }

      }, 500);


      // Store finish timer for cleanup
      return () => {
        clearTimeout(finishTimer);
      };

    }, 2300);


    // ─────────────────────────────────────────────────────────────────────────
    // CLEANUP
    // ─────────────────────────────────────────────────────────────────────────

    return () => {

      mounted = false;

      clearTimeout(timer);

    };

  }, [fadeAnim, onFinish]);


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