// ─── LoginScreen.js ───────────────────────────────────────────────────────────
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Animated, StatusBar, Dimensions, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ onFinish, selectedLocation, initialTab = 'login' }) {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  const [tab, setTab] = useState(initialTab);          // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const tabAnim = useRef(new Animated.Value(initialTab === 'login' ? 0 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 14, bounciness: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  // Update tab state if initialTab prop changes
  useEffect(() => {
    if (initialTab !== tab) {
      setTab(initialTab);
      Animated.spring(tabAnim, {
        toValue: initialTab === 'login' ? 0 : 1,
        useNativeDriver: false,
        speed: 20,
        bounciness: 0,
      }).start();
    }
  }, [initialTab]);

  const switchTab = (t) => {
    setTab(t);
    setError('');
    Animated.spring(tabAnim, {
      toValue: t === 'login' ? 0 : 1,
      useNativeDriver: false,
      speed: 20,
      bounciness: 0,
    }).start();
  };

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (tab === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);

    if (tab === 'signup') {
      // 1. Registration: Redirect to Login page (Sign In tab)
      await new Promise(r => setTimeout(r, 1200));
      setLoading(false);
      switchTab('login');
      setPassword(''); // Clear sensitive info
      return;
    }

    // 2. Login: Access the main app
    await new Promise(r => setTimeout(r, 1200));
    const userData = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email: email.trim(),
      phone: phone.trim(),
      location: selectedLocation,
    };
    await signIn(userData);
    setLoading(false);
    Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
      onFinish();
    });
  };

  const handleGuest = async () => {
    const guestData = { id: 'guest', name: 'Guest', email: '', location: selectedLocation };
    await signIn(guestData);
    Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
      onFinish();
    });
  };

  const indicatorLeft = tabAnim.interpolate({ inputRange: [0, 1], outputRange: ['2%', '52%'] });

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#1A0830', '#492760', '#6B3D8A']} style={StyleSheet.absoluteFill} />

      {/* Deco circles */}
      <View style={styles.decoCircle1} />
      <View style={styles.decoCircle2} />

      {/* Logo area */}
      <Animated.View style={[styles.logoWrap, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>☕</Text>
        </View>
        <Text style={styles.logoText}>Hafsum</Text>
        <Text style={styles.logoSub}>COFFEE & CAKE</Text>
        {selectedLocation && (
          <View style={styles.locPill}>
            <Ionicons name="location" size={12} color="#fff" />
            <Text style={styles.locPillText}>{selectedLocation.area}</Text>
          </View>
        )}
      </Animated.View>

      {/* Card */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <Animated.View
          style={[styles.card, { paddingBottom: insets.bottom + 16, transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.handle} />

          {/* Tab switcher */}
          <View style={styles.tabRow}>
            <Animated.View style={[styles.tabIndicator, { left: indicatorLeft }]} />
            <TouchableOpacity style={styles.tabBtn} onPress={() => switchTab('login')}>
              <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabBtn} onPress={() => switchTab('signup')}>
              <Text style={[styles.tabText, tab === 'signup' && styles.tabTextActive]}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Name — signup only */}
            {tab === 'signup' && (
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            {/* Email */}
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone — signup only */}
            {tab === 'signup' && (
              <View style={styles.inputWrap}>
                <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="#9CA3AF"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            )}

            {/* Password */}
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Error */}
            {!!error && (
              <View style={styles.errorWrap}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Forgot password - login only */}
            {tab === 'login' && (
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            {/* Submit */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
              <LinearGradient
                colors={['#6B3D8A', '#492760']}
                style={styles.submitGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons
                      name={tab === 'login' ? 'log-in-outline' : 'person-add-outline'}
                      size={20}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.submitText}>
                      {tab === 'login' ? 'Sign In' : 'Create Account'}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Guest */}
            <TouchableOpacity style={styles.guestBtn} onPress={handleGuest}>
              <Ionicons name="walk-outline" size={18} color="#492760" style={{ marginRight: 6 }} />
              <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  decoCircle1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.05)', top: -80, left: -80,
  },
  decoCircle2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.04)', top: 60, right: -60,
  },

  // Logo
  logoWrap: { alignItems: 'center', paddingTop: height * 0.1, paddingBottom: 24 },
  logoCircle: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)',
  },
  logoEmoji: { fontSize: 36 },
  logoText: { fontSize: 34, fontWeight: '900', color: '#fff', letterSpacing: 2, fontFamily: 'Poppins-Bold' },
  logoSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: 4, marginTop: 2 },
  locPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, marginTop: 10,
  },
  locPillText: { fontSize: 12, color: '#fff', fontWeight: '600', marginLeft: 4 },

  // Card
  kav: { flex: 1 },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingTop: 12, paddingHorizontal: 22,
    flex: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15, shadowRadius: 16, elevation: 20,
  },
  handle: {
    alignSelf: 'center', width: 44, height: 4,
    borderRadius: 2, backgroundColor: '#E5E7EB', marginBottom: 20,
  },

  // Tabs
  tabRow: {
    flexDirection: 'row', backgroundColor: '#F3F4F6',
    borderRadius: 14, padding: 4, marginBottom: 24, position: 'relative',
  },
  tabIndicator: {
    position: 'absolute', top: 4, bottom: 4,
    width: '46%', backgroundColor: '#492760', borderRadius: 11,
  },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, zIndex: 1 },
  tabText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#fff' },

  // Inputs
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F9FAFB', borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    paddingHorizontal: 14, marginBottom: 14, height: 54,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1A0D2E' },
  eyeBtn: { padding: 4 },

  // Error
  errorWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FEF2F2', borderRadius: 10,
    padding: 10, marginBottom: 10,
  },
  errorText: { fontSize: 13, color: '#EF4444', marginLeft: 6 },

  // Forgot
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 18 },
  forgotText: { fontSize: 13, color: '#492760', fontWeight: '600' },

  // Submit
  submitBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 18 },
  submitGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16,
  },
  submitText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { fontSize: 13, color: '#9CA3AF', marginHorizontal: 12 },

  // Guest
  guestBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#492760', borderRadius: 16,
    paddingVertical: 14, marginBottom: 8,
  },
  guestText: { fontSize: 15, fontWeight: '700', color: '#492760' },
});
