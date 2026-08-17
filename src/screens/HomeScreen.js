// ─── Home Screen ──────────────────────────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Shadows } from '../theme';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../components/ToastNotification';
import { PRODUCTS } from '../api/mockData';

const PRIMARY = Colors?.primary || '#492760';
const TEXT = '#1A0D2E';
const MUTED = '#6B5F7A';
const WHITE = '#ffffff';

// ─────────────────────────────────────────────────────────────────────────────
// SPECIAL PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────
function SpecialProductCard({ product, onAdd, isFav, onFav }) {
  return (
    <View style={styles.specialCard}>
      <View style={styles.topVariantRow}>
        <View style={styles.variantLeft}>
          <Ionicons name="gift-outline" size={18} color={MUTED} />
          <Text style={styles.variantText}>Whole (2.5 lb)</Text>
        </View>
        <TouchableOpacity style={styles.outlineAddBtn} onPress={() => onAdd(product)}>
          <Ionicons name="add" size={20} color={PRIMARY} />
          <Text style={styles.outlineAddText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image source={product.image} style={styles.specialImage} resizeMode="cover" />
        <TouchableOpacity style={styles.favBtn} onPress={() => onFav(product)}>
          <Ionicons name={isFav ? "heart" : "heart-outline"} size={26} color={isFav ? "#E8445A" : WHITE} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.specialContent}>
        <Text style={styles.specialName}>{product.name}</Text>
        <Text style={styles.specialDesc}>{product.description}</Text>

        <View style={styles.priceTable}>
          <View style={styles.priceRow}>
            <View style={{ flex: 1 }} />
            <Text style={styles.priceHeader}>Slice</Text>
            <Text style={styles.priceHeader}>2.5 lb</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Rs.</Text>
            <Text style={styles.priceValue}>{product.slicePrice || '825'}</Text>
            <Text style={styles.priceValue}>{product.price.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.variantRow}>
          <View style={styles.variantLeft}>
            <Ionicons name="cut-outline" size={18} color={MUTED} />
            <Text style={styles.variantText}>Per Slice</Text>
          </View>
          <TouchableOpacity style={styles.solidAddBtn} onPress={() => onAdd(product)}>
            <Ionicons name="add" size={20} color={WHITE} />
            <Text style={styles.solidAddText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.variantRow}>
          <View style={styles.variantLeft}>
            <Ionicons name="gift-outline" size={18} color={MUTED} />
            <Text style={styles.variantText}>Whole (2.5 lb)</Text>
          </View>
          <TouchableOpacity style={styles.outlineAddBtn} onPress={() => onAdd(product)}>
            <Ionicons name="add" size={20} color={PRIMARY} />
            <Text style={styles.outlineAddText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { dispatch, itemCount } = useCart();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { showToast } = useToast();

  const handleAdd = (product) => {
    dispatch({ type: 'ADD', payload: { product, qty: 1 } });
    showToast(`✓ ${product.name} added to cart!`);
  };

  const specialItems = PRODUCTS.filter(p => p.isSpecial);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* FIXED HEADER - Standardized for all tabs */}
      <LinearGradient
        colors={['#2E1540', '#492760']}
        style={[styles.header, { paddingTop: insets.top + 15 }]}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerIcons}>
            <Text style={styles.emojiIcon}>☕</Text>
            <Text style={styles.emojiIcon}>🎂</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <View style={styles.bagIconWrap}>
              <Ionicons name="bag-outline" size={24} color={WHITE} />
              {itemCount > 0 && <View style={styles.badge} />}
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.logoText}>Hafsum</Text>
        <Text style={styles.logoSub}>COFFEE & CAKE</Text>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
      >
        <View style={styles.titleWrap}>
          <Text style={styles.sectionTitle}>✨ Special Cakes</Text>
          <Text style={styles.sectionSubtitle}>Handcrafted with love — every slice tells a story</Text>
        </View>

        <View style={styles.content}>
          {specialItems.map(product => (
            <SpecialProductCard 
              key={product.id} 
              product={product} 
              onAdd={handleAdd} 
              isFav={isFavorite(product.id)}
              onFav={toggleFavorite}
            />
          ))}
        </View>

        {favorites.length > 0 && (
          <View style={styles.favoritesSection}>
            <View style={styles.favHeader}>
              <Text style={styles.sectionTitle}>Your Favorites ❤️</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.favList}>
              {favorites.map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.favItem}
                  onPress={() => navigation.navigate('Menu', { searchQuery: item.name })}
                >
                  <Image source={item.image} style={styles.favImage} />
                  <Text style={styles.favName} numberOfLines={1}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f4fb' },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 10,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  headerIcons: { flexDirection: 'row', gap: 10 },
  emojiIcon: { fontSize: 26 },
  bagIconWrap: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  badge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E8445A' },
  logoText: { color: WHITE, fontSize: 34, fontWeight: '900', fontStyle: 'italic' },
  logoSub: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '700', letterSpacing: 2.5, marginTop: -4 },
  titleWrap: { alignItems: 'center', marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: TEXT },
  sectionSubtitle: { fontSize: 14, color: MUTED, fontStyle: 'italic', marginTop: 4, textAlign: 'center' },
  content: { padding: 16 },
  specialCard: { backgroundColor: WHITE, borderRadius: 28, marginBottom: 25, overflow: 'hidden', ...Shadows.md },
  topVariantRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: WHITE },
  imageContainer: { position: 'relative' },
  specialImage: { width: '100%', height: 240 },
  favBtn: { position: 'absolute', top: 15, right: 15, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' },
  specialContent: { padding: 20 },
  specialName: { fontSize: 22, fontWeight: '800', color: TEXT, marginBottom: 8 },
  specialDesc: { fontSize: 15, color: MUTED, lineHeight: 22, marginBottom: 18 },
  priceTable: { backgroundColor: '#f5f0fa', borderRadius: 18, padding: 15, marginBottom: 20 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  priceHeader: { width: 80, textAlign: 'center', fontSize: 13, fontWeight: '700', color: PRIMARY },
  priceLabel: { flex: 1, fontSize: 13, color: MUTED },
  priceValue: { width: 80, textAlign: 'center', fontSize: 18, fontWeight: '800', color: TEXT },
  variantRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f0e8f8' },
  variantLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  variantText: { fontSize: 15, fontWeight: '600', color: TEXT },
  solidAddBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: PRIMARY, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 25, gap: 6 },
  solidAddText: { color: WHITE, fontSize: 14, fontWeight: '700' },
  outlineAddBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 25, borderWidth: 1.5, borderColor: PRIMARY, gap: 6 },
  outlineAddText: { color: PRIMARY, fontSize: 14, fontWeight: '700' },
  favoritesSection: { marginTop: 5, paddingLeft: 20 },
  favHeader: { marginBottom: 15 },
  favList: { paddingRight: 20 },
  favItem: { width: 80, marginRight: 15, alignItems: 'center' },
  favImage: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: PRIMARY },
  favName: { fontSize: 11, color: TEXT, fontWeight: '600', marginTop: 6, textAlign: 'center' },
});
