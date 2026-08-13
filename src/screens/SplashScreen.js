// ─── Splash Screen ────────────────────────────────────────────────────────────
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, StatusBar, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const logoScale   = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dividerWidth = useRef(new Animated.Value(0)).current;
  const productTranslate = useRef(new Animated.Value(120)).current;
  const productOpacity   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo entrance
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      // Divider
      Animated.timing(dividerWidth, { toValue: 60, duration: 400, useNativeDriver: false }),
      // Tagline
      Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      // Product image slides up
      Animated.parallel([
        Animated.spring(productTranslate, { toValue: 0, friction: 7, tension: 50, useNativeDriver: true }),
        Animated.timing(productOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      // Hold for 1.2s
      Animated.delay(1200),
    ]).start(() => onFinish && onFinish());
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary, '#5C3575']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Decorative circles */}
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      {/* Logo area */}
      <Animated.View
        style={[styles.logoArea, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
      >
        {/* Icon row */}
        <View style={styles.iconRow}>
          <View style={styles.iconBadge}>
            <Text style={styles.iconEmoji}>☕</Text>
          </View>
          <View style={[styles.iconBadge, styles.iconBadgeRight]}>
            <Text style={styles.iconEmoji}>🎂</Text>
          </View>
        </View>

        {/* Brand name */}
        <Text style={styles.brandName}>Hafsum</Text>
        <View style={styles.subBadge}>
          <Text style={styles.subBadgeText}>COFFEE &amp; CAKE</Text>
        </View>

        {/* Divider */}
        <Animated.View style={[styles.divider, { width: dividerWidth }]} />

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Sweet Moments, Perfectly Brewed.
        </Animated.Text>
        <View style={styles.heartRow}>
          <Text style={styles.heart}>♥</Text>
        </View>
      </Animated.View>

      {/* Product image */}
      <Animated.View
        style={[
          styles.productWrap,
          { opacity: productOpacity, transform: [{ translateY: productTranslate }] },
        ]}
      >
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80' }}
          style={styles.productImg}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  circleTopLeft: {
    width: 280,
    height: 280,
    top: -80,
    left: -80,
  },
  circleBottomRight: {
    width: 220,
    height: 220,
    bottom: 80,
    right: -60,
  },
  logoArea: {
    alignItems: 'center',
    marginTop: height * 0.12,
  },
  iconRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  iconBadgeRight: {
    marginTop: -16,
  },
  iconEmoji: {
    fontSize: 26,
  },
  brandName: {
    fontSize: 52,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -1,
    fontStyle: 'italic',
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subBadge: {
    borderWidth: 1.5,
    borderColor: Colors.white,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginBottom: 20,
  },
  subBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
  },
  divider: {
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginBottom: 14,
  },
  tagline: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  heartRow: {
    marginTop: 10,
  },
  heart: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  productWrap: {
    position: 'absolute',
    bottom: 0,
    width: width * 0.92,
    height: height * 0.38,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  productImg: {
    width: '100%',
    height: '100%',
  },
});
