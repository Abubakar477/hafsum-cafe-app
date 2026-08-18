// ─── LocationScreen.js ────────────────────────────────────────────────────────
// Beautiful location picker shown once after the splash screen.

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, StatusBar, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const LOCATIONS = [
  {
    id: 'dha',
    area: 'DHA Phase 5',
    city: 'Lahore',
    address: 'Main Blvd, Block E, DHA Phase 5',
    badge: '⭐ Most Popular',
    badgeColor: '#F59E0B',
    openTime: '8:00 AM – 11:00 PM',
  },
  {
    id: 'gulberg',
    area: 'Gulberg III',
    city: 'Lahore',
    address: 'Main MM Alam Road, Gulberg III',
    badge: '🔥 Trending',
    badgeColor: '#EF4444',
    openTime: '9:00 AM – 12:00 AM',
  },
  {
    id: 'johar',
    area: 'Johar Town',
    city: 'Lahore',
    address: 'Block P, Johar Town',
    badge: '🆕 New',
    badgeColor: '#10B981',
    openTime: '9:00 AM – 11:00 PM',
  },
  {
    id: 'bahria',
    area: 'Bahria Town',
    city: 'Lahore',
    address: 'Sector C Commercial, Bahria Town',
    badge: null,
    openTime: '9:00 AM – 11:00 PM',
  },
  {
    id: 'model',
    area: 'Model Town',
    city: 'Lahore',
    address: 'Link Road, Model Town',
    badge: null,
    openTime: '8:30 AM – 10:30 PM',
  },
];

export default function LocationScreen({ onFinish }) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(null);

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const pinBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade + slide in
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 14, bounciness: 8, useNativeDriver: true }),
    ]).start();

    // Pin bounce loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pinBounce, { toValue: -12, duration: 500, useNativeDriver: true }),
        Animated.timing(pinBounce, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleContinue = () => {
    if (!selected) return;
    Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
      onFinish(selected);
    });
  };

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Purple gradient background */}
      <LinearGradient colors={['#1A0830', '#492760', '#6B3D8A']} style={StyleSheet.absoluteFill} />

      {/* Floating decorative circles */}
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      {/* Animated map pin */}
      <Animated.View style={[styles.pinWrap, { transform: [{ translateY: pinBounce }] }]}>
        <View style={styles.pinOuter}>
          <View style={styles.pinInner}>
            <Ionicons name="location" size={36} color="#492760" />
          </View>
        </View>
        <View style={styles.pinShadow} />
      </Animated.View>

      {/* Bottom sheet card */}
      <Animated.View
        style={[
          styles.card,
          { paddingBottom: insets.bottom + 16, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Handle bar */}
        <View style={styles.handle} />

        <Text style={styles.title}>Choose Your Branch</Text>
        <Text style={styles.subtitle}>Select the nearest Hafsum Café to you</Text>

        {/* Location list */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.listScroll}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          {LOCATIONS.map((loc) => {
            const isSelected = selected?.id === loc.id;
            return (
              <TouchableOpacity
                key={loc.id}
                style={[styles.locItem, isSelected && styles.locItemSelected]}
                onPress={() => setSelected(loc)}
                activeOpacity={0.8}
              >
                {/* Icon */}
                <View style={[styles.locIcon, isSelected && styles.locIconSelected]}>
                  <Ionicons
                    name={isSelected ? 'location' : 'location-outline'}
                    size={22}
                    color={isSelected ? '#fff' : '#492760'}
                  />
                </View>

                {/* Info */}
                <View style={styles.locInfo}>
                  <View style={styles.locNameRow}>
                    <Text style={[styles.locArea, isSelected && styles.locAreaSelected]}>
                      {loc.area}
                    </Text>
                    {loc.badge && (
                      <View style={[styles.badge, { backgroundColor: loc.badgeColor + '22' }]}>
                        <Text style={[styles.badgeText, { color: loc.badgeColor }]}>{loc.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.locAddress} numberOfLines={1}>{loc.address}</Text>
                  <View style={styles.locTimeRow}>
                    <Ionicons name="time-outline" size={12} color="#9CA3AF" />
                    <Text style={styles.locTime}>{loc.openTime}</Text>
                  </View>
                </View>

                {/* Check */}
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Continue button */}
        <TouchableOpacity
          style={[styles.continueBtn, !selected && styles.continueBtnDisabled]}
          onPress={handleContinue}
          activeOpacity={selected ? 0.85 : 1}
        >
          <LinearGradient
            colors={selected ? ['#6B3D8A', '#492760'] : ['#D1D5DB', '#D1D5DB']}
            style={styles.continueBtnGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="navigate" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.continueBtnText}>
              {selected ? `Continue to ${selected.area}` : 'Select a Branch'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },

  // Background deco
  circle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  circleTopLeft: { top: -80, left: -80 },
  circleBottomRight: { bottom: 200, right: -100 },

  // Pin
  pinWrap: {
    position: 'absolute',
    top: height * 0.15,
    alignSelf: 'center',
    alignItems: 'center',
  },
  pinOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinShadow: {
    marginTop: 6,
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: height * 0.72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#1A0D2E', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },

  // Location list
  listScroll: { maxHeight: height * 0.38 },
  locItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F5FF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  locItemSelected: {
    borderColor: '#492760',
    backgroundColor: '#F3E8FF',
  },
  locIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locIconSelected: { backgroundColor: '#492760' },
  locInfo: { flex: 1 },
  locNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  locArea: { fontSize: 15, fontWeight: '800', color: '#1A0D2E', marginRight: 8 },
  locAreaSelected: { color: '#492760' },
  locAddress: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  locTimeRow: { flexDirection: 'row', alignItems: 'center' },
  locTime: { fontSize: 11, color: '#9CA3AF', marginLeft: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#492760',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  // Continue button
  continueBtn: { marginTop: 16, borderRadius: 18, overflow: 'hidden' },
  continueBtnDisabled: { opacity: 0.7 },
  continueBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  continueBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
