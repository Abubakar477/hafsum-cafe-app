// src/components/DrawerMenu.js
// ─── Left Side Drawer Menu (replaces Profile tab) ────────────────────────────
import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  Animated, ScrollView, Dimensions, StatusBar, Linking, Alert, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radii } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { LOCATIONS } from '../screens/LocationScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.80;

const BRANCHES = [
  {
    id: 'b1',
    name: 'Bahria Enclave',
    address: 'Babu Plaza, 1, Sector A, Bahria Enclave, Islamabad',
    hours: '11:00 AM – 11:00 PM',
    icon: 'storefront-outline',
    mapsQuery: 'Babu+Plaza+Sector+A+Bahria+Enclave+Islamabad',
  },
  {
    id: 'b2',
    name: 'Bahria Phase 4',
    address: 'Best Western Central Rawalpindi, Paradise Commercial, Plot 84, Bahria Phase 4',
    hours: '11:00 AM – 11:00 PM',
    icon: 'business-outline',
    mapsQuery: 'Best+Western+Central+Rawalpindi+Bahria+Phase+4',
  },
];

export default function DrawerMenu({ visible, onClose, navigation }) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { user, signIn, signOut } = useAuth();
  const { orders } = useOrders();
  const [branchesExpanded, setBranchesExpanded] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(LOCATIONS[0]);

  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalSpend = orders.reduce((s, o) => s + (o.total || 0), 0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNavigate = (screen) => {
    onClose();
    setTimeout(() => navigation.navigate(screen), 250);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => { signOut(); onClose(); } },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      {/* Drawer Panel */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }], paddingTop: insets.top }]}>
        
        {/* ── Header / User Info ── */}
        <LinearGradient colors={['#2E1540', '#492760']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          {/* Logo image (same as home page) */}
          <Image
            source={require('../../assets/images/topheaderlogo.jpeg')}
            style={styles.headerLogo}
            resizeMode="contain"
          />

          {/* Choose Location */}
          <View style={styles.locationSection}>
            <Text style={styles.locationLabel}>📍 Choose Location</Text>
            {LOCATIONS.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                style={[styles.locationBtn, selectedBranch?.id === loc.id && styles.locationBtnActive]}
                onPress={() => setSelectedBranch(loc)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={selectedBranch?.id === loc.id ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={selectedBranch?.id === loc.id ? '#fff' : 'rgba(255,255,255,0.6)'}
                />
                <Text style={[styles.locationBtnText, selectedBranch?.id === loc.id && styles.locationBtnTextActive]}>
                  {loc.area}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stats row */}
          {user && (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{orders.length}</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedOrders}</Text>
                <Text style={styles.statLabel}>Done</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>Rs. {totalSpend > 0 ? (totalSpend / 1000).toFixed(1) + 'k' : '0'}</Text>
                <Text style={styles.statLabel}>Spent</Text>
              </View>
            </View>
          )}
        </LinearGradient>

        {/* ── Menu Items ── */}
        <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
          
          {/* Notifications Toggle */}
          <View style={styles.drawerItemRow}>
            <View style={styles.itemIconWrap}>
              <Ionicons name="notifications-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.itemLabel}>Notifications</Text>
            <TouchableOpacity
              style={[styles.toggle, notifications && styles.toggleOn]}
              onPress={() => setNotifications(n => !n)}
            >
              <View style={[styles.toggleThumb, notifications && styles.toggleThumbOn]} />
            </TouchableOpacity>
          </View>

          {/* Language */}
          <View style={styles.drawerItemRow}>
            <View style={styles.itemIconWrap}>
              <Ionicons name="language-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.itemLabel}>Language</Text>
            <View style={styles.langBadge}>
              <Text style={styles.langBadgeText}>English</Text>
            </View>
          </View>

          <View style={styles.sectionDivider} />
          <Text style={styles.sectionLabel}>OUR BRANCHES</Text>

          {/* Branches */}
          {BRANCHES.map(b => (
            <TouchableOpacity
              key={b.id}
              style={styles.branchRow}
              onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${b.mapsQuery}`)}
              activeOpacity={0.75}
            >
              <View style={styles.itemIconWrap}>
                <Ionicons name={b.icon} size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.branchName}>{b.name}</Text>
                <Text style={styles.branchHours}>{b.hours}</Text>
              </View>
              <Ionicons name="navigate-outline" size={16} color={Colors.primary} />
            </TouchableOpacity>
          ))}

          {/* Sign Out */}
          {user && (
            <>
              <View style={styles.sectionDivider} />
              <TouchableOpacity style={styles.signOutRow} onPress={handleSignOut} activeOpacity={0.75}>
                <View style={[styles.itemIconWrap, { backgroundColor: '#FFF0F0' }]}>
                  <Ionicons name="log-out-outline" size={20} color="#E53935" />
                </View>
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

function DrawerItem({ icon, label, onPress, accent }) {
  return (
    <TouchableOpacity style={styles.drawerItemRow} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.itemIconWrap, accent && { backgroundColor: Colors.primary + '20' }]}>
        <Ionicons name={icon} size={20} color={accent ? Colors.primary : Colors.primary} />
      </View>
      <Text style={[styles.itemLabel, accent && { color: Colors.primary, fontWeight: '700' }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#C5C5C7" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 10,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: 4,
    marginBottom: 8,
  },
  headerLogo: {
    width: '80%',
    height: 55,
    alignSelf: 'center',
    marginBottom: 14,
  },
  locationSection: {
    marginBottom: 6,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  locationBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  locationBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.65)',
    flex: 1,
  },
  locationBtnTextActive: {
    color: '#fff',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  logoEmoji: { fontSize: 26 },
  logoName: {
    fontSize: 22,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#fff',
    letterSpacing: 0.5,
  },
  logoSub: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2.5,
    marginTop: -2,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#fff' },
  userName: { fontSize: 15, fontWeight: '800', color: '#fff' },
  userSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingVertical: 10,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 14, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginVertical: 4 },
  menuList: { flex: 1 },
  sectionDivider: { height: 1, backgroundColor: '#EFEFEF', marginHorizontal: 20, marginVertical: 6 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAA',
    letterSpacing: 1.2,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  drawerItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  itemIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  toggle: {
    width: 40,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D1D1D6',
    justifyContent: 'center',
    padding: 2,
  },
  toggleOn: { backgroundColor: Colors.primary },
  toggleThumb: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff' },
  toggleThumbOn: { alignSelf: 'flex-end' },
  langBadge: {
    backgroundColor: Colors.primary + '18',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  langBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  branchName: { fontSize: 14, fontWeight: '700', color: '#1C1C1E' },
  branchHours: { fontSize: 11, color: '#888', marginTop: 1 },
  signOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  signOutText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#E53935' },
});
