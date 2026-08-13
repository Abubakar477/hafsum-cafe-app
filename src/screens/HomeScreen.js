// ─── Home Screen ──────────────────────────────────────────────────────────────
import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, StatusBar, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows } from '../theme';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

// ── Cake Data ─────────────────────────────────────────────────────────────────
const SPECIAL_CAKES = [
  {
    id: 'oreo_choc',
    name: 'Oreo Chocolate Cheesecake',
    description: 'Rich chocolate base layered with creamy Oreo-studded filling, topped with crushed cookie crumble and silky ganache drizzle.',
    slicePrice: 825,
    fullPrice: 6500,
    image: { uri: 'https://images.unsplash.com/photo-1567327613485-fdd46cc58b44?w=500&q=80' },
    badge: '🏆 Best Seller',
  },
  {
    id: 'choc_truffle',
    name: 'Chocolate Truffle Cheesecake',
    description: 'Velvety smooth chocolate cheesecake with a decadent truffle ganache center, dusted with premium cocoa powder.',
    slicePrice: 825,
    fullPrice: 6500,
    image: { uri: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80' },
    badge: '🍫 Fan Favourite',
  },
  {
    id: 'new_york',
    name: 'New York Cheesecake',
    description: 'Classic dense and ultra-creamy New York-style cheesecake on a buttery graham cracker crust. Timeless perfection.',
    slicePrice: 825,
    fullPrice: 6500,
    image: { uri: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80' },
    badge: '⭐ Classic',
  },
  {
    id: 'san_sebastian',
    name: 'San Sebastian Cheesecake',
    description: 'Rustic Basque-style cheesecake with a deeply caramelized top and a silky, molten-soft center. Unmistakably indulgent.',
    slicePrice: 825,
    fullPrice: 6500,
    image: { uri: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80' },
    badge: '🔥 Trending',
  },
  {
    id: 'blueberry',
    name: 'Blueberry Cheese Cake',
    description: 'Light and fluffy cheesecake crowned with a luscious fresh blueberry compote and glazed whole berries.',
    slicePrice: 825,
    fullPrice: 6500,
    image: { uri: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80' },
    badge: '🫐 Fresh Pick',
  },
];

// ── Toast Notification ─────────────────────────────────────────────────────────
function Toast({ message, visible }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <Ionicons name="checkmark-circle" size={18} color="#fff" />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

// ── Cake Card ─────────────────────────────────────────────────────────────────
function CakeCard({ cake, cartItems, onAddSlice, onAddFull, onChangeQty }) {
  const sliceKey = `${cake.id}_slice_default_`;
  const fullKey  = `${cake.id}_full_default_`;

  const sliceItem = cartItems.find(i => i.key === sliceKey);
  const fullItem  = cartItems.find(i => i.key === fullKey);

  const sliceQty = sliceItem?.qty ?? 0;
  const fullQty  = fullItem?.qty  ?? 0;

  return (
    <View style={styles.card}>
      {/* Image */}
      <View style={styles.cardImgWrap}>
        <Image source={cake.image} style={styles.cardImg} resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.cardImgOverlay}
        />
        <View style={styles.badgeWrap}>
          <Text style={styles.badgeText}>{cake.badge}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <Text style={styles.cakeName}>{cake.name}</Text>
        <Text style={styles.cakeDesc}>{cake.description}</Text>

        {/* Price Table */}
        <View style={styles.priceTable}>
          <View style={styles.priceHeaderRow}>
            <Text style={styles.priceHeaderSpacer} />
            <Text style={styles.priceHeaderCol}>Slice</Text>
            <Text style={styles.priceHeaderCol}>2.5 lb</Text>
          </View>
          <View style={styles.priceValueRow}>
            <Text style={styles.priceLabel}>Rs.</Text>
            <Text style={styles.priceValue}>825</Text>
            <Text style={styles.priceValue}>6,500</Text>
          </View>
        </View>

        {/* Slice Controls */}
        <View style={styles.productRow}>
          <View style={styles.productRowLeft}>
            <Ionicons name="cut-outline" size={14} color="#7a6a8a" />
            <Text style={styles.productRowLabel}>Per Slice</Text>
          </View>
          {sliceQty === 0 ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => onAddSlice(cake)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => onChangeQty(sliceKey, -1)}
              >
                <Ionicons name="remove" size={16} color="#492760" />
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{sliceQty}</Text>
              <TouchableOpacity
                style={[styles.qtyBtn, styles.qtyBtnAdd]}
                onPress={() => onChangeQty(sliceKey, 1)}
              >
                <Ionicons name="add" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 2.5 lb Controls */}
        <View style={[styles.productRow, { marginTop: 8 }]}>
          <View style={styles.productRowLeft}>
            <Ionicons name="gift-outline" size={14} color="#7a6a8a" />
            <Text style={styles.productRowLabel}>Whole (2.5 lb)</Text>
          </View>
          {fullQty === 0 ? (
            <TouchableOpacity
              style={[styles.addBtn, styles.addBtnOutline]}
              onPress={() => onAddFull(cake)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color="#492760" />
              <Text style={[styles.addBtnText, { color: '#492760' }]}>Add</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => onChangeQty(fullKey, -1)}
              >
                <Ionicons name="remove" size={16} color="#492760" />
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{fullQty}</Text>
              <TouchableOpacity
                style={[styles.qtyBtn, styles.qtyBtnAdd]}
                onPress={() => onChangeQty(fullKey, 1)}
              >
                <Ionicons name="add" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

// ── Main HomeScreen ───────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const { items, dispatch, itemCount, total } = useCart();
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message: msg });
    toastTimer.current = setTimeout(() => setToast({ visible: false, message: msg }), 2000);
  };

  const handleAddSlice = (cake) => {
    dispatch({
      type: 'ADD',
      payload: {
        product: {
          id: `${cake.id}_slice`,
          name: `${cake.name} (Slice)`,
          price: cake.slicePrice,
          image: cake.image,
        },
        qty: 1,
      },
    });
    showToast(`${cake.name} slice added! 🎂`);
  };

  const handleAddFull = (cake) => {
    dispatch({
      type: 'ADD',
      payload: {
        product: {
          id: `${cake.id}_full`,
          name: `${cake.name} (2.5 lb)`,
          price: cake.fullPrice,
          image: cake.image,
        },
        qty: 1,
      },
    });
    showToast(`${cake.name} (2.5 lb) added! 🎁`);
  };

  const handleChangeQty = (key, delta) => {
    if (delta > 0) {
      dispatch({ type: 'INCREMENT', payload: key });
    } else {
      dispatch({ type: 'DECREMENT', payload: key });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2d1640" />

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />

      {/* ── Header ── */}
      <LinearGradient
        colors={['#2d1640', '#492760']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerLogo}>
            <Text style={styles.logoIcons}>☕  🎂</Text>
            <Text style={styles.logoName}>Hafsum</Text>
            <Text style={styles.logoSub}>COFFEE & CAKE</Text>
          </View>

          {/* Cart Button with badge */}
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.8}
          >
            <Ionicons name="bag-outline" size={24} color="#fff" />
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.headerTagline}>
          <Text style={styles.sectionHeading}>✨ Special Cakes</Text>
          <Text style={styles.sectionSub}>Handcrafted with love — every slice tells a story</Text>
        </View>
      </LinearGradient>

      {/* ── Cake List ── */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: itemCount > 0 ? 110 : 30 }]}
      >
        {SPECIAL_CAKES.map((cake) => (
          <CakeCard
            key={cake.id}
            cake={cake}
            cartItems={items}
            onAddSlice={handleAddSlice}
            onAddFull={handleAddFull}
            onChangeQty={handleChangeQty}
          />
        ))}
      </ScrollView>

      {/* ── Floating Cart Bar ── */}
      {itemCount > 0 && (
        <TouchableOpacity
          style={styles.floatingCart}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#492760', '#6b3d8a']}
            style={styles.floatingCartGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.floatingCartBadge}>
              <Text style={styles.floatingCartCount}>{itemCount}</Text>
            </View>
            <Text style={styles.floatingCartText}>View Cart</Text>
            <Text style={styles.floatingCartTotal}>Rs. {total.toLocaleString()}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0fa' },

  // Toast
  toast: {
    position: 'absolute', top: 60, alignSelf: 'center',
    zIndex: 999, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#2d1640', paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 30, gap: 8,
    ...Shadows.md,
  },
  toastText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  // Header
  header: {
    paddingTop: 52,
    paddingHorizontal: Spacing.base,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerLogo: { alignItems: 'center' },
  logoIcons: { fontSize: 20, marginBottom: 2 },
  logoName: { fontSize: 26, fontWeight: '800', fontStyle: 'italic', color: '#fff', letterSpacing: -0.5 },
  logoSub: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.75)', letterSpacing: 2.5 },

  cartBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: '#e8445a',
    borderRadius: 10, minWidth: 18, height: 18,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5, borderColor: '#fff',
  },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },

  headerTagline: { alignItems: 'center' },
  sectionHeading: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  sectionSub: { fontSize: 13, color: 'rgba(255,255,255,0.72)', fontStyle: 'italic' },

  // List
  scroll: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 20, gap: 20 },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadows.md,
  },
  cardImgWrap: { position: 'relative', height: 200 },
  cardImg: { width: '100%', height: '100%' },
  cardImgOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
  badgeWrap: {
    position: 'absolute', top: 12, left: 12,
    backgroundColor: 'rgba(73,39,96,0.88)',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  cardBody: { padding: 16 },
  cakeName: { fontSize: 18, fontWeight: '800', color: '#2d1640', marginBottom: 6 },
  cakeDesc: { fontSize: 13, color: '#7a6a8a', lineHeight: 19, marginBottom: 14 },

  // Price Table
  priceTable: {
    backgroundColor: '#f5f0fa', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14,
    borderWidth: 1, borderColor: '#e8dff0',
  },
  priceHeaderRow: { flexDirection: 'row', marginBottom: 4 },
  priceHeaderSpacer: { flex: 1 },
  priceHeaderCol: { width: 80, textAlign: 'center', fontSize: 12, fontWeight: '700', color: '#492760' },
  priceValueRow: { flexDirection: 'row', alignItems: 'center' },
  priceLabel: { flex: 1, fontSize: 12, fontWeight: '600', color: '#5a4a6a' },
  priceValue: { width: 80, textAlign: 'center', fontSize: 15, fontWeight: '800', color: '#2d1640' },

  // Product row with controls
  productRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1, borderTopColor: '#f0e8f8',
  },
  productRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  productRowLabel: { fontSize: 13, fontWeight: '600', color: '#5a4a6a' },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#492760',
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnOutline: {
    backgroundColor: '#f0e8f8',
    borderWidth: 1.5, borderColor: '#492760',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // Quantity controls
  qtyControl: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f5f0fa', borderRadius: 20,
    borderWidth: 1, borderColor: '#e0d0f0', overflow: 'hidden',
  },
  qtyBtn: {
    width: 34, height: 34,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f5f0fa',
  },
  qtyBtnAdd: { backgroundColor: '#492760' },
  qtyNum: { width: 30, textAlign: 'center', fontSize: 15, fontWeight: '800', color: '#2d1640' },

  // Floating Cart
  floatingCart: {
    position: 'absolute', bottom: 16, left: 16, right: 16,
    borderRadius: 18, overflow: 'hidden',
    ...Shadows.md,
  },
  floatingCartGradient: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 16,
  },
  floatingCartBadge: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  floatingCartCount: { color: '#fff', fontWeight: '800', fontSize: 13 },
  floatingCartText: { flex: 1, color: '#fff', fontWeight: '700', fontSize: 16 },
  floatingCartTotal: { color: 'rgba(255,255,255,0.9)', fontWeight: '800', fontSize: 15 },
});
