// ─── Profile Screen ───────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState('signin');
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
        <LinearGradient 
          colors={[Colors.primaryDark, Colors.primary]} 
          style={[styles.authHeader, { paddingTop: Math.max(insets.top, 20) }]}
        >
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
        </LinearGradient>

        <ScrollView style={styles.authScroll} showsVerticalScrollIndicator={false}>
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
                <Text style={styles.guestSubtitle}>Browse the menu and place orders without an account.</Text>
              </View>
            ) : (
              <>
                {mode === 'signup' && <AuthField label="Full Name" value={name} onChangeText={setName} placeholder="Your name" />}
                <AuthField label="Phone Number" value={phone} onChangeText={setPhone} placeholder="03XX XXXXXXX" keyboardType="phone-pad" />
                {mode === 'signup' && <AuthField label="Email Address" value={email} onChangeText={setEmail} placeholder="email@example.com" keyboardType="email-address" />}
                {mode === 'signin' && <AuthField label="Password" value="" onChangeText={() => {}} placeholder="••••••••" secureTextEntry />}
                {mode === 'signup' && <AuthField label="Password" value="" onChangeText={() => {}} placeholder="Create a password" secureTextEntry />}
              </>
            )}
            <TouchableOpacity style={styles.authBtn} onPress={handleSubmit}>
              <Text style={styles.authBtnText}>{mode === 'guest' ? 'Continue as Guest' : mode === 'signin' ? 'Sign In' : 'Create Account'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 40 + insets.bottom }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

function AuthField({ label, value, onChangeText, placeholder, keyboardType, secureTextEntry }) {
  return (
    <View style={styles.authFieldWrap}>
      <Text style={styles.authFieldLabel}>{label}</Text>
      <TextInput style={styles.authField} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={Colors.textMuted} keyboardType={keyboardType} secureTextEntry={secureTextEntry} autoCapitalize="none" />
    </View>
  );
}

function SettingRow({ item, notifications, onToggle }) {
  return (
    <TouchableOpacity style={styles.settingRow} activeOpacity={0.75}>
      <View style={styles.settingIcon}><Ionicons name={item.icon} size={20} color={Colors.primary} /></View>
      <Text style={styles.settingLabel}>{item.label}</Text>
      <View style={styles.settingRight}>
        {item.type === 'toggle' ? (
          <TouchableOpacity style={[styles.toggle, notifications && styles.toggleOn]} onPress={onToggle}>
            <View style={[styles.toggleThumb, notifications && styles.toggleThumbOn]} />
          </TouchableOpacity>
        ) : (
          <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, signIn, signOut } = useAuth();
  const { orders } = useOrders();
  const [authVisible, setAuthVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Sign Out', style: 'destructive', onPress: signOut }]);
  };

  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalSpend = orders.reduce((s, o) => s + o.total, 0);
  const TAB_BAR_HEIGHT = 70 + (insets.bottom > 0 ? insets.bottom - 10 : 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* FIXED HEADER - Standardized with exactly the same height/curve as other tabs */}
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        style={[styles.header, { paddingTop: insets.top + 15 }]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Profile</Text>
          {user && (
            <TouchableOpacity><Ionicons name="create-outline" size={22} color={Colors.white} /></TouchableOpacity>
          )}
        </View>

        <View style={styles.avatarArea}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user ? user.name.charAt(0).toUpperCase() : '?'}</Text>
          </View>
          <Text style={styles.userName}>{user ? user.name : 'Welcome to Hafsum'}</Text>
          <Text style={styles.userPhone}>{user ? (user.phone || user.email) : 'Sign in to access your profile'}</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 20 }}
      >
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
              <Text style={styles.statValue}>Rs. {totalSpend.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
          </View>
        )}

        {!user && (
          <View style={styles.signInCard}>
            <Text style={styles.signInTitle}>Join Hafsum 🎉</Text>
            <TouchableOpacity style={styles.signInBtn} onPress={() => setAuthVisible(true)}>
              <Text style={styles.signInBtnText}>Sign In / Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            {SETTINGS.map(item => (
              <SettingRow key={item.id} item={item} notifications={notifications} onToggle={() => setNotifications(n => !n)} />
            ))}
          </View>
        </View>

        {user && (
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <AuthModal visible={authVisible} onClose={() => setAuthVisible(false)} onSignIn={signIn} />
    </View>
  );
}

function ProfileRow({ icon, label, value, showArrow }) {
  return (
    <View style={styles.profileRow}>
      <View style={styles.profileIcon}><Ionicons name={icon} size={18} color={Colors.primary} /></View>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue} numberOfLines={1}>{value}</Text>
      {showArrow && <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    paddingHorizontal: 20, paddingBottom: 25,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.white },
  avatarArea: { alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', marginBottom: 10 },
  avatarText: { fontSize: 28, fontWeight: '800', color: Colors.white },
  userName: { fontSize: 18, fontWeight: '800', color: Colors.white, marginBottom: 2 },
  userPhone: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: Radii.lg, padding: Spacing.md, margin: 20, ...Shadows.sm },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border, marginHorizontal: 5 },
  signInCard: { backgroundColor: Colors.white, borderRadius: Radii.lg, margin: 20, padding: 20, alignItems: 'center', ...Shadows.sm },
  signInTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 15 },
  signInBtn: { backgroundColor: Colors.primary, borderRadius: Radii.full, paddingVertical: 12, paddingHorizontal: 30 },
  signInBtnText: { color: Colors.white, fontWeight: '700' },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
  card: { backgroundColor: Colors.white, borderRadius: Radii.lg, ...Shadows.sm },
  profileRow: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: Colors.border },
  profileIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.primaryFade, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  profileLabel: { flex: 1, fontSize: 14, color: Colors.textSecondary },
  profileValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: Colors.border },
  settingIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.primaryFade, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  settingLabel: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  settingRight: { flexDirection: 'row', alignItems: 'center' },
  toggle: { width: 40, height: 20, borderRadius: 10, backgroundColor: Colors.border, justifyContent: 'center', padding: 2 },
  toggleOn: { backgroundColor: Colors.primary },
  toggleThumb: { width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.white },
  toggleThumbOn: { alignSelf: 'flex-end' },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: Colors.white, marginHorizontal: 20, borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.error + '30', gap: 8 },
  signOutText: { fontSize: 15, fontWeight: '700', color: Colors.error },
  authContainer: { flex: 1, backgroundColor: Colors.offWhite },
  authHeader: { paddingHorizontal: 20, paddingBottom: 25 },
  authHeaderRow: { marginBottom: 15 },
  authLogoArea: { alignItems: 'center' },
  authEmoji: { fontSize: 32, marginBottom: 4 },
  authLogoName: { fontSize: 32, fontWeight: '800', fontStyle: 'italic', color: Colors.white },
  authLogoSub: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 2.5 },
  authScroll: { flex: 1 },
  modeTabs: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: Radii.full, margin: 20, padding: 4, ...Shadows.sm },
  modeTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radii.full },
  modeTabActive: { backgroundColor: Colors.primary },
  modeTabText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  modeTabTextActive: { color: Colors.white },
  authForm: { paddingHorizontal: 20 },
  authFieldWrap: { marginBottom: 15 },
  authFieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 5 },
  authField: { backgroundColor: Colors.white, borderRadius: Radii.md, borderWidth: 1, borderColor: Colors.border, padding: 12 },
  authBtn: { backgroundColor: Colors.primary, borderRadius: Radii.full, paddingVertical: 15, alignItems: 'center', marginTop: 10 },
  authBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  guestBox: { alignItems: 'center', paddingVertical: 20 },
  guestIcon: { fontSize: 50, marginBottom: 10 },
  guestTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  guestSubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
});
