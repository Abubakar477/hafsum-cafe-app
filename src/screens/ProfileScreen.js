// ─── Profile Screen ───────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, StatusBar, SafeAreaView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, Shadows } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';

const SETTINGS = [
  { id: 'notifications', icon: 'notifications-outline',    label: 'Notifications',      type: 'toggle' },
  { id: 'language',      icon: 'language-outline',          label: 'Language',           type: 'nav',   value: 'English' },
  { id: 'branches',      icon: 'storefront-outline',        label: 'Our Branches',       type: 'nav' },
  { id: 'help',          icon: 'help-circle-outline',       label: 'Help & Support',     type: 'nav' },
  { id: 'privacy',       icon: 'shield-checkmark-outline',  label: 'Privacy Policy',     type: 'nav' },
  { id: 'about',         icon: 'information-circle-outline',label: 'About Hafsum',       type: 'nav' },
];

// ─── Guest Sign-In Modal ──────────────────────────────────────────────────────
function AuthModal({ visible, onClose, onSignIn }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'guest'
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (mode === 'guest') {
      onSignIn({ name: 'Guest', phone: '', email: '', isGuest: true });
    } else {
      onSignIn({ name, phone, email, isGuest: false });
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.authContainer}>
        <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.authHeader}>
          <SafeAreaView>
            <View style={styles.authHeaderRow}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.authLogoArea}>
              <Text style={styles.authEmoji}>☕🎂</Text>
              <Text style={styles.authLogoName}>Hafsum</Text>
              <Text style={styles.authLogoSub}>COFFEE &amp; CAKE</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <ScrollView style={styles.authScroll} showsVerticalScrollIndicator={false}>
          {/* Mode tabs */}
          <View style={styles.modeTabs}>
            {[['signin', 'Sign In'], ['signup', 'Sign Up'], ['guest', 'Guest']].map(([k, l]) => (
              <TouchableOpacity
                key={k}
                style={[styles.modeTab, mode === k && styles.modeTabActive]}
                onPress={() => setMode(k)}
              >
                <Text style={[styles.modeTabText, mode === k && styles.modeTabTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.authForm}>
            {mode === 'guest' ? (
              <View style={styles.guestBox}>
                <Text style={styles.guestIcon}>👤</Text>
                <Text style={styles.guestTitle}>Continue as Guest</Text>
                <Text style={styles.guestSubtitle}>
                  Browse the menu and place orders without an account.
                  Your order history won't be saved.
                </Text>
              </View>
            ) : (
              <>
                {mode === 'signup' && (
                  <AuthField label="Full Name" value={name} onChangeText={setName} placeholder="Your name" />
                )}
                <AuthField label="Phone Number" value={phone} onChangeText={setPhone} placeholder="+966 5X XXX XXXX" keyboardType="phone-pad" />
                {mode === 'signup' && (
                  <AuthField label="Email Address" value={email} onChangeText={setEmail} placeholder="email@example.com" keyboardType="email-address" />
                )}
                {mode === 'signin' && (
                  <AuthField label="Password" value="" onChangeText={() => {}} placeholder="••••••••" secureTextEntry />
                )}
                {mode === 'signup' && (
                  <AuthField label="Password" value="" onChangeText={() => {}} placeholder="Create a password" secureTextEntry />
                )}
              </>
            )}

            <TouchableOpacity style={styles.authBtn} onPress={handleSubmit}>
              <Text style={styles.authBtnText}>
                {mode === 'guest' ? 'Continue as Guest' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function AuthField({ label, value, onChangeText, placeholder, keyboardType, secureTextEntry }) {
  return (
    <View style={styles.authFieldWrap}>
      <Text style={styles.authFieldLabel}>{label}</Text>
      <TextInput
        style={styles.authField}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );
}

// ─── Setting Row ──────────────────────────────────────────────────────────────
function SettingRow({ item, notifications, onToggle }) {
  return (
    <TouchableOpacity style={styles.settingRow} activeOpacity={0.75}>
      <View style={styles.settingIcon}>
        <Ionicons name={item.icon} size={20} color={Colors.primary} />
      </View>
      <Text style={styles.settingLabel}>{item.label}</Text>
      <View style={styles.settingRight}>
        {item.type === 'toggle' ? (
          <TouchableOpacity
            style={[styles.toggle, notifications && styles.toggleOn]}
            onPress={onToggle}
          >
            <View style={[styles.toggleThumb, notifications && styles.toggleThumbOn]} />
          </TouchableOpacity>
        ) : (
          <>
            {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }) {
  const { user, signIn, signOut } = useAuth();
  const { orders } = useOrders();
  const [authVisible, setAuthVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalSpend = orders.reduce((s, o) => s + o.total, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>Profile</Text>
              {user && (
                <TouchableOpacity>
                  <Ionicons name="create-outline" size={22} color={Colors.white} />
                </TouchableOpacity>
              )}
            </View>

            {/* Avatar */}
            <View style={styles.avatarArea}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user ? user.name.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
              {user ? (
                <>
                  <Text style={styles.userName}>{user.name}</Text>
                  {!user.isGuest && <Text style={styles.userPhone}>{user.phone || user.email}</Text>}
                  {user.isGuest && (
                    <View style={styles.guestBadge}>
                      <Text style={styles.guestBadgeText}>Guest Account</Text>
                    </View>
                  )}
                </>
              ) : (
                <>
                  <Text style={styles.userName}>Welcome to Hafsum</Text>
                  <Text style={styles.userPhone}>Sign in to access your profile</Text>
                </>
              )}
            </View>

            {/* Stats */}
            {user && (
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{orders.length}</Text>
                  <Text style={styles.statLabel}>Orders</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{completedOrders}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>${totalSpend.toFixed(0)}</Text>
                  <Text style={styles.statLabel}>Total Spent</Text>
                </View>
              </View>
            )}
          </SafeAreaView>
        </LinearGradient>

        {/* Sign in prompt if not logged in */}
        {!user && (
          <View style={styles.signInCard}>
            <Text style={styles.signInTitle}>Join Hafsum 🎉</Text>
            <Text style={styles.signInSub}>
              Sign in to track orders, save addresses and get exclusive offers.
            </Text>
            <TouchableOpacity style={styles.signInBtn} onPress={() => setAuthVisible(true)}>
              <Text style={styles.signInBtnText}>Sign In / Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.guestLinkBtn} onPress={() => {
              signIn({ name: 'Guest', phone: '', email: '', isGuest: true });
            }}>
              <Text style={styles.guestLinkText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Account details */}
        {user && !user.isGuest && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Details</Text>
            <View style={styles.card}>
              <ProfileRow icon="person-outline" label="Name" value={user.name} />
              <ProfileRow icon="call-outline" label="Phone" value={user.phone || '—'} />
              <ProfileRow icon="mail-outline" label="Email" value={user.email || '—'} />
              <ProfileRow icon="location-outline" label="Saved Addresses" value="Manage" showArrow />
            </View>
          </View>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            {SETTINGS.map(item => (
              <SettingRow
                key={item.id}
                item={item}
                notifications={notifications}
                onToggle={() => setNotifications(n => !n)}
              />
            ))}
          </View>
        </View>

        {/* Sign out */}
        {user && (
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}

        <View style={styles.brand}>
          <Text style={styles.brandName}>☕ Hafsum Coffee &amp; Cake</Text>
          <Text style={styles.brandTagline}>Sweet Moments, Perfectly Brewed.</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <AuthModal
        visible={authVisible}
        onClose={() => setAuthVisible(false)}
        onSignIn={signIn}
      />
    </View>
  );
}

function ProfileRow({ icon, label, value, showArrow }) {
  return (
    <View style={styles.profileRow}>
      <View style={styles.profileIcon}>
        <Ionicons name={icon} size={18} color={Colors.primary} />
      </View>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue} numberOfLines={1}>{value}</Text>
      {showArrow && <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} style={{ marginLeft: 4 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },

  // Header
  header: {
    paddingTop: 52, paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.white },

  // Avatar
  avatarArea: { alignItems: 'center', marginBottom: Spacing.lg },
  avatar: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: Spacing.md,
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: Colors.white },
  userName: { fontSize: 20, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  userPhone: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  guestBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radii.full,
    paddingVertical: 3, paddingHorizontal: 12, marginTop: 6,
  },
  guestBadgeText: { color: Colors.white, fontSize: 12, fontWeight: '600' },

  // Stats
  statsRow: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radii.lg, padding: Spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.white },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginHorizontal: Spacing.sm },

  // Sign in card
  signInCard: {
    backgroundColor: Colors.white, borderRadius: Radii.lg,
    margin: Spacing.base, padding: Spacing.xl,
    alignItems: 'center', ...Shadows.md,
  },
  signInTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  signInSub: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: Spacing.lg },
  signInBtn: {
    backgroundColor: Colors.primary, borderRadius: Radii.full,
    paddingVertical: 13, paddingHorizontal: 36, marginBottom: Spacing.md, ...Shadows.sm,
  },
  signInBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  guestLinkBtn: { paddingVertical: 6 },
  guestLinkText: { color: Colors.primary, fontWeight: '600', fontSize: 14 },

  // Sections
  section: { paddingHorizontal: Spacing.base, marginBottom: Spacing.md },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.md },
  card: { backgroundColor: Colors.white, borderRadius: Radii.lg, ...Shadows.sm },

  // Profile rows
  profileRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  profileIcon: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.primaryFade,
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
  },
  profileLabel: { width: 80, fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  profileValue: { flex: 1, fontSize: 14, color: Colors.textPrimary, fontWeight: '500', textAlign: 'right' },

  // Setting rows
  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  settingIcon: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.primaryFade,
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
  },
  settingLabel: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { fontSize: 13, color: Colors.textMuted },
  toggle: {
    width: 44, height: 24, borderRadius: 12,
    backgroundColor: Colors.border,
    justifyContent: 'center', padding: 2,
  },
  toggleOn: { backgroundColor: Colors.primary },
  toggleThumb: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.white, ...Shadows.sm,
  },
  toggleThumbOn: { alignSelf: 'flex-end' },

  // Sign out
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, backgroundColor: Colors.white,
    marginHorizontal: Spacing.base, borderRadius: Radii.lg,
    borderWidth: 1.5, borderColor: Colors.error + '30',
    marginBottom: Spacing.lg, gap: 8,
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: Colors.error },

  // Brand footer
  brand: { alignItems: 'center', paddingVertical: Spacing.lg },
  brandName: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  brandTagline: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic', marginTop: 3 },
  version: { fontSize: 11, color: Colors.textMuted, marginTop: 8 },

  // Auth Modal
  authContainer: { flex: 1, backgroundColor: Colors.offWhite },
  authHeader: {
    paddingTop: 52, paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl,
  },
  authHeaderRow: { marginBottom: Spacing.lg },
  authLogoArea: { alignItems: 'center' },
  authEmoji: { fontSize: 32, marginBottom: 4 },
  authLogoName: { fontSize: 32, fontWeight: '800', fontStyle: 'italic', color: Colors.white },
  authLogoSub: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 2.5, marginTop: 2 },
  authScroll: { flex: 1 },

  modeTabs: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderRadius: Radii.full, margin: Spacing.base,
    padding: 4, ...Shadows.sm,
  },
  modeTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radii.full },
  modeTabActive: { backgroundColor: Colors.primary },
  modeTabText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  modeTabTextActive: { color: Colors.white },

  authForm: { paddingHorizontal: Spacing.base },
  authFieldWrap: { marginBottom: Spacing.md },
  authFieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  authField: {
    backgroundColor: Colors.white, borderRadius: Radii.md,
    borderWidth: 1.5, borderColor: Colors.border,
    padding: Spacing.md, fontSize: 14, color: Colors.textPrimary,
  },
  authBtn: {
    backgroundColor: Colors.primary, borderRadius: Radii.full,
    paddingVertical: 15, alignItems: 'center',
    marginTop: Spacing.lg, ...Shadows.md,
  },
  authBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },

  guestBox: { alignItems: 'center', paddingVertical: Spacing.xl },
  guestIcon: { fontSize: 56, marginBottom: Spacing.md },
  guestTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  guestSubtitle: {
    fontSize: 14, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },
});
