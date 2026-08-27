// ─── Profile Screen ───────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, StatusBar, Alert, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radii, Shadows } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';

const BRANCHES = [
  {
    id: 'b1',
    name: 'Hafsum — Bahria Enclave',
    address: 'Babu Plaza, 1, Sector A,\nBahria Enclave, Islamabad',
    hours: '11:00 AM – 11:00 PM',
    phone: '+92 300 0000000',
    emoji: '🏢',
    mapsQuery: 'Babu+Plaza+Sector+A+Bahria+Enclave+Islamabad',
  },
  {
    id: 'b2',
    name: 'Hafsum — Bahria Phase 4',
    address: 'Best Western Central Rawalpindi,\nParadise Commercial, Plot 84, Shop 1,\nGround Floor, Bahria Phase 4, Islamabad',
    hours: '11:00 AM – 11:00 PM',
    phone: '+92 300 0000000',
    emoji: '🏨',
    mapsQuery: 'Best+Western+Central+Rawalpindi+Bahria+Phase+4',
  },
];

const SETTINGS = [
  { id: 'notifications', icon: 'notifications-outline', label: 'Notifications', type: 'toggle' },
  { id: 'language',      icon: 'language-outline',       label: 'Language',      type: 'badge', value: 'English' },
  { id: 'branches',      icon: 'storefront-outline',     label: 'Our Branches',  type: 'nav' },
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

// ─── Branches Modal ───────────────────────────────────────────────────────────
function BranchesModal({ visible, onClose }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>Our Branches</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {BRANCHES.map((b, i) => (
            <View key={b.id} style={[styles.branchCard, i > 0 && { marginTop: 12 }]}>
              <LinearGradient
                colors={['#2E1540', '#492760']}
                style={styles.branchCardHeader}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={styles.branchEmoji}>{b.emoji}</Text>
                <Text style={styles.branchName}>{b.name}</Text>
              </LinearGradient>
              <View style={styles.branchCardBody}>
                <View style={styles.branchInfoRow}>
                  <Ionicons name="location-outline" size={16} color={Colors.primary} style={{ marginTop: 1 }} />
                  <Text style={styles.branchInfoText}>{b.address}</Text>
                </View>
                <View style={styles.branchInfoRow}>
                  <Ionicons name="time-outline" size={16} color={Colors.primary} />
                  <Text style={styles.branchInfoText}>{b.hours}</Text>
                </View>
                <TouchableOpacity
                  style={styles.mapsBtn}
                  onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${b.mapsQuery}`)}
                >
                  <Ionicons name="navigate-outline" size={15} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.mapsBtnText}>Open in Maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

function SettingRow({ item, notifications, onToggle, onPress }) {
  return (
    <TouchableOpacity style={styles.settingRow} activeOpacity={0.75} onPress={onPress}>
      <View style={styles.settingIcon}><Ionicons name={item.icon} size={20} color={Colors.primary} /></View>
      <Text style={styles.settingLabel}>{item.label}</Text>
      <View style={styles.settingRight}>
        {item.type === 'toggle' ? (
          <TouchableOpacity style={[styles.toggle, notifications && styles.toggleOn]} onPress={onToggle}>
            <View style={[styles.toggleThumb, notifications && styles.toggleThumbOn]} />
          </TouchableOpacity>
        ) : item.type === 'badge' ? (
          <View style={styles.langBadge}>
            <Text style={styles.langBadgeText}>{item.value}</Text>
          </View>
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
  const [branchesVisible, setBranchesVisible] = useState(false);

  const handleSettingPress = (id) => {
    if (id === 'branches') setBranchesVisible(true);
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
              <SettingRow
                key={item.id}
                item={item}
                notifications={notifications}
                onToggle={() => setNotifications(n => !n)}
                onPress={() => handleSettingPress(item.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <AuthModal visible={authVisible} onClose={() => setAuthVisible(false)} onSignIn={signIn} />
      <BranchesModal visible={branchesVisible} onClose={() => setBranchesVisible(false)} />
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
  langBadge: { backgroundColor: Colors.primaryFade, borderRadius: Radii.full, paddingHorizontal: 10, paddingVertical: 3 },
  langBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  // Branches Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 12 },
  modalHandle: { width: 44, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', alignSelf: 'center', marginBottom: 18 },
  modalHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  modalCloseBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  branchCard: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#EDE7F6' },
  branchCardHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 10 },
  branchEmoji: { fontSize: 22 },
  branchName: { fontSize: 15, fontWeight: '800', color: '#fff', flex: 1 },
  branchCardBody: { backgroundColor: '#faf8fc', padding: 14, gap: 8 },
  branchInfoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  branchInfoText: { fontSize: 13, color: Colors.textSecondary, flex: 1, lineHeight: 19 },
  mapsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: 20, paddingVertical: 8, marginTop: 6 },
  mapsBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: Colors.white, marginHorizontal: 20, borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.error + '30', gap: 8 },
  signOutText: { fontSize: 15, fontWeight: '700', color: Colors.error },
  authContainer: { flex: 1, backgroundColor: Colors.offWhite },
  authHeader: { paddingHorizontal: 20, paddingBottom: 25 },
  authHeaderRow: { marginBottom: 15 },
  authLogoArea: { alignItems: 'center' },
  authEmoji: { fontSize: 32, marginBottom: 4 },
  authLogoName: { fontSize: 32, fontWeight: '800', fontStyle: 'italic', color: Colors.white, fontFamily: 'Poppins-Bold' },
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
