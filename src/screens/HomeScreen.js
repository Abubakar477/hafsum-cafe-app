// ─── Home Screen ──────────────────────────────────────────────────────────────
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  FlatList, TextInput, Dimensions, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, Shadows, Typography } from '../theme';
import { PRODUCTS, CATEGORIES, BANNERS } from '../api/mockData';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');
const BANNER_W = width - Spacing.base * 2;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning 🤚';
  if (h < 17) return 'Good Afternoon ☀️';
  return 'Good Evening 🌙';
}

// ── Banner Carousel ──────────────────────────────────────────────────────────
function BannerCarousel({ navigation }) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);

  const onScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / BANNER_W);
    setActive(idx);
  };

  return (
    <View style={styles.bannerSection}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        decelerationRate="fast"
        snapToInterval={BANNER_W + Spacing.md}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        {BANNERS.map((b) => (
          <TouchableOpacity
            key={b.id}
            activeOpacity={0.92}
            style={[styles.bannerCard, { backgroundColor: b.bg }]}
            onPress={() => navigation.navigate('Menu')}
          >
            <View style={styles.bannerContent}>
              <Text style={styles.bannerLabel}>{b.title}</Text>
              <Text style={styles.bannerTitle}>{b.subtitle}</Text>
              <TouchableOpacity
                style={styles.bannerCta}
                onPress={() => navigation.navigate('Menu')}
              >
                <Text style={styles.bannerCtaText}>{b.cta}</Text>
              </TouchableOpacity>
            </View>
            <Image source={{ uri: b.image }} style={styles.bannerImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Dots */}
      <View style={styles.dots}>
        {BANNERS.map((_, i) => (
          <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

// ── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ item, onAdd, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onAdd(item);
  };

  return (
    <TouchableOpacity style={styles.productCard} onPress={() => onPress(item)} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={styles.productImg} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity style={styles.addBtn} onPress={press}>
              <Ionicons name="add" size={20} color={Colors.white} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Category Chip ─────────────────────────────────────────────────────────────
function CategoryChip({ cat, onPress }) {
  return (
    <TouchableOpacity style={styles.catChip} onPress={() => onPress(cat)} activeOpacity={0.8}>
      <View style={styles.catIcon}>
        <Text style={styles.catEmoji}>{cat.icon}</Text>
      </View>
      <Text style={styles.catName}>{cat.name}</Text>
    </TouchableOpacity>
  );
}

// ── Main HomeScreen ──────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const { dispatch } = useCart();
  const [search, setSearch] = useState('');

  const popularItems = PRODUCTS.filter(p => p.popular);
  const displayedCats = CATEGORIES.filter(c => c.id !== 'all').slice(0, 6);

  const handleAdd = (product) => {
    dispatch({ type: 'ADD', payload: { product, qty: 1 } });
  };

  const handleCategoryPress = (cat) => {
    navigation.navigate('Menu', { categoryId: cat.id });
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 1) {
      navigation.navigate('Menu', { searchQuery: text });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* ── Purple Header ── */}
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuBtn}>
            <Ionicons name="menu" size={26} color={Colors.white} />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.headerLogo}>
            <Text style={styles.logoIconRow}>☕🎂</Text>
            <Text style={styles.logoName}>Hafsum</Text>
            <Text style={styles.logoSub}>COFFEE &amp; CAKE</Text>
          </View>

          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.greetingSub}>What would you like today?</Text>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for coffee, cakes…"
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ── Scrollable Content ── */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banners */}
        <BannerCarousel navigation={navigation} />

        {/* Popular Items */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Items</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={popularItems}
          keyExtractor={i => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularList}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onAdd={handleAdd}
              onPress={(p) => navigation.navigate('Menu', { openProduct: p.id })}
            />
          )}
        />

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={displayedCats}
          keyExtractor={i => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catList}
          renderItem={({ item }) => (
            <CategoryChip cat={item} onPress={handleCategoryPress} />
          )}
        />

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },

  // Header
  header: {
    paddingTop: 52,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  menuBtn: { padding: 4 },
  notifBtn: { padding: 4 },
  headerLogo: { alignItems: 'center' },
  logoIconRow: { fontSize: 18, marginBottom: -2 },
  logoName: {
    fontSize: 24, fontWeight: '800', fontStyle: 'italic',
    color: Colors.white, letterSpacing: -0.5,
  },
  logoSub: {
    fontSize: 8, fontWeight: '700', color: Colors.white,
    letterSpacing: 2.5, opacity: 0.8, marginTop: 0,
  },

  // Greeting
  greeting: { fontSize: 20, fontWeight: '700', color: Colors.white, marginBottom: 2 },
  greetingSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: Spacing.md },

  // Search
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.md,
    height: 46,
    ...Shadows.sm,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  filterBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.base, paddingTop: Spacing.lg },

  // Section headers
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  viewAll: { fontSize: 14, fontWeight: '600', color: Colors.primary },

  // Banner
  bannerSection: { marginBottom: Spacing.xl },
  bannerCard: {
    width: BANNER_W,
    height: 160,
    borderRadius: Radii.lg,
    marginRight: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    ...Shadows.md,
  },
  bannerContent: { flex: 1, padding: Spacing.lg },
  bannerLabel: { fontSize: 12, fontWeight: '600', color: Colors.accent, marginBottom: 4 },
  bannerTitle: { fontSize: 18, fontWeight: '800', color: Colors.white, lineHeight: 24, marginBottom: 14 },
  bannerCta: {
    backgroundColor: Colors.accent, borderRadius: Radii.full,
    paddingVertical: 8, paddingHorizontal: 18, alignSelf: 'flex-start',
  },
  bannerCtaText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  bannerImage: { width: 130, height: '100%', resizeMode: 'cover' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.border, marginHorizontal: 3 },
  dotActive: { backgroundColor: Colors.primary, width: 20 },

  // Product cards
  popularList: { paddingBottom: Spacing.sm },
  productCard: {
    width: 145,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    marginRight: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  productImg: { width: '100%', height: 110, resizeMode: 'cover' },
  productInfo: { padding: Spacing.sm },
  productName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  productPriceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  productPrice: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  addBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },

  // Categories
  catList: { paddingBottom: Spacing.sm },
  catChip: { alignItems: 'center', marginRight: Spacing.md, width: 72 },
  catIcon: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6, ...Shadows.sm,
  },
  catEmoji: { fontSize: 26 },
  catName: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
});
