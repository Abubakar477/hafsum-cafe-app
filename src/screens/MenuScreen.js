// ─── Menu Screen ──────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image,
  TextInput, Dimensions, StatusBar, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../theme';
import { PRODUCTS, CATEGORIES } from '../api/mockData';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

const PRIMARY = Colors?.primary || '#492760';
const WHITE = '#ffffff';
const TEXT = '#1A0D2E';
const MUTED = '#6B5F7A';

// ── Menu Card ─────────────────────────────────────────────────────────────────
function MenuCard({ item, onAdd }) {
  return (
    <View style={styles.menuCard}>
      <Image 
        source={item.image} 
        style={styles.menuCardImg} 
        resizeMode="cover" 
      />
      <View style={styles.menuCardInfo}>
        <Text style={styles.menuCardName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.menuCardDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.menuCardRow}>
          <Text style={styles.menuCardPrice}>Rs. {item.price.toLocaleString()}</Text>
          <TouchableOpacity style={styles.menuAddBtn} onPress={() => onAdd(item)}>
            <Ionicons name="add" size={20} color={WHITE} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ── MenuScreen ────────────────────────────────────────────────────────────────
export default function MenuScreen({ navigation }) {
  const { dispatch } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  // Includes ALL products (specials + regular menu items)
  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'all' || p.categoryId === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleQuickAdd = (product) => {
    dispatch({ type: 'ADD', payload: { product, qty: 1 } });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#2E1540', '#492760']}
          style={styles.headerGradient}
        >
          <SafeAreaView>
            <View style={styles.headerTopRow}>
              <Text style={styles.headerTitle}>Our Menu</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                <View style={styles.bagIconWrap}>
                  <Ionicons name="bag-outline" size={24} color={WHITE} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
              <Ionicons name="search" size={20} color={MUTED} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                placeholderTextColor={MUTED}
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      {/* Category Tabs */}
      <View style={styles.catTabsContainer}>
        <FlatList
          data={CATEGORIES}
          keyExtractor={i => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catTabsContent}
          renderItem={({ item }) => {
            const isActive = activeCategory === item.id;
            return (
              <TouchableOpacity
                style={[styles.catTab, isActive && styles.catTabActive]}
                onPress={() => setActiveCategory(item.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.catIconWrap, isActive && styles.catIconWrapActive]}>
                   <Text style={styles.catIcon}>{item.icon}</Text>
                </View>
                <Text style={[styles.catTabText, isActive && styles.catTabTextActive]} numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>


      {/* Products Grid */}
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MenuCard item={item} onAdd={handleQuickAdd} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        }
      />
    </View>
  );
}

const CARD_W = (width - 48) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f4fb' },

  header: {
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerGradient: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: WHITE,
  },
  bagIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    ...Shadows.sm,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: TEXT },

  // Category Tabs
  catTabsContainer: {
    backgroundColor: WHITE,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e8f8',
  },
  catTabsContent: {
    paddingHorizontal: 15,
  },
  catTab: {
    alignItems: 'center',
    width: 85,
    marginRight: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    ...Shadows.sm,
  },
  catTabActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  catIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#f3eef9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  catIconWrapActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  catIcon: {
    fontSize: 22,
  },
  catTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT,
  },
  catTabTextActive: {
    color: WHITE,
  },

  // Grid
  grid: { padding: 16, paddingBottom: 100 },
  gridRow: { justifyContent: 'space-between' },

  // Menu Card
  menuCard: {
    width: CARD_W,
    backgroundColor: WHITE,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  menuCardImg: { width: '100%', height: 120 },
  menuCardInfo: { padding: 12 },
  menuCardName: { fontSize: 14, fontWeight: '800', color: TEXT, marginBottom: 4 },
  menuCardDesc: { fontSize: 11, color: MUTED, lineHeight: 15, marginBottom: 10 },
  menuCardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  menuCardPrice: { fontSize: 14, fontWeight: '800', color: PRIMARY },
  menuAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: { flex: 1, alignItems: 'center', padding: 40 },
  emptyText: { color: MUTED, fontSize: 16 },
});
