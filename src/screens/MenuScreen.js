// ─── Menu Screen ──────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image,
  TextInput, Modal, ScrollView, Dimensions, StatusBar, Animated,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, Shadows } from '../theme';
import { PRODUCTS, CATEGORIES } from '../api/mockData';
import { useCart } from '../context/CartContext';

const { width, height } = Dimensions.get('window');

// ── Product Detail Modal ──────────────────────────────────────────────────────
function ProductModal({ product, visible, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const slideY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[1] ?? product.sizes?.[0] ?? null);
      setSelectedAddons([]);
      setQty(1);
    }
  }, [product]);

  useEffect(() => {
    Animated.spring(slideY, {
      toValue: visible ? 0 : height,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!product) return null;

  const basePrice = selectedSize?.price ?? product.price;
  const addonTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
  const unitPrice = basePrice + addonTotal;

  const toggleAddon = (addon) => {
    setSelectedAddons(prev =>
      prev.find(a => a.id === addon.id)
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="none">
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.modalSheet, { transform: [{ translateY: slideY }] }]}>
        <View style={styles.modalHandle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Image source={typeof product.image === 'string' ? { uri: product.image } : product.image} style={styles.modalImage} />

          <View style={styles.modalContent}>
            <Text style={styles.modalName}>{product.name}</Text>
            <Text style={styles.modalDesc}>{product.description}</Text>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <>
                <Text style={styles.optionLabel}>Size</Text>
                <View style={styles.optionRow}>
                  {product.sizes.map(s => (
                    <TouchableOpacity
                      key={s.id}
                      style={[styles.optionChip, selectedSize?.id === s.id && styles.optionChipActive]}
                      onPress={() => setSelectedSize(s)}
                    >
                      <Text style={[styles.optionChipText, selectedSize?.id === s.id && styles.optionChipTextActive]}>
                        {s.label}
                      </Text>
                      <Text style={[styles.optionChipPrice, selectedSize?.id === s.id && styles.optionChipTextActive]}>
                        ${s.price.toFixed(2)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Add-ons */}
            {product.addons?.length > 0 && (
              <>
                <Text style={styles.optionLabel}>Add-ons</Text>
                {product.addons.map(a => {
                  const on = selectedAddons.find(x => x.id === a.id);
                  return (
                    <TouchableOpacity
                      key={a.id}
                      style={[styles.addonRow, on && styles.addonRowActive]}
                      onPress={() => toggleAddon(a)}
                    >
                      <View style={[styles.addonCheck, on && styles.addonCheckActive]}>
                        {on && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                      </View>
                      <Text style={styles.addonLabel}>{a.label}</Text>
                      <Text style={styles.addonPrice}>+${a.price.toFixed(2)}</Text>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}

            {/* Quantity */}
            <Text style={styles.optionLabel}>Quantity</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(q => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(q => q + 1)}
              >
                <Ionicons name="add" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Add to Cart */}
        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => {
              onAddToCart({ product, qty, size: selectedSize, addons: selectedAddons });
              onClose();
            }}
          >
            <Text style={styles.addToCartText}>
              Add to Cart · ${(unitPrice * qty).toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ── Menu Card ─────────────────────────────────────────────────────────────────
function MenuCard({ item, onPress, onAdd }) {
  return (
    <TouchableOpacity style={styles.menuCard} onPress={() => onPress(item)} activeOpacity={0.88}>
      <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.menuCardImg} />
      <View style={styles.menuCardInfo}>
        <Text style={styles.menuCardName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.menuCardDesc} numberOfLines={2}>{item.description}</Text>
        <View style={styles.menuCardRow}>
          <Text style={styles.menuCardPrice}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.menuAddBtn} onPress={() => onAdd(item)}>
            <Ionicons name="add" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── MenuScreen ────────────────────────────────────────────────────────────────
export default function MenuScreen({ route, navigation }) {
  const { dispatch } = useCart();
  const [activeCategory, setActiveCategory] = useState(route?.params?.categoryId ?? 'all');
  const [search, setSearch] = useState(route?.params?.searchQuery ?? '');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // If routed with a specific product to open
  useEffect(() => {
    if (route?.params?.openProduct) {
      const p = PRODUCTS.find(x => x.id === route.params.openProduct);
      if (p) { setSelectedProduct(p); setModalVisible(true); }
    }
    if (route?.params?.categoryId) setActiveCategory(route.params.categoryId);
    if (route?.params?.searchQuery) setSearch(route.params.searchQuery);
  }, [route?.params]);

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'all' || p.categoryId === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openProduct = (p) => { setSelectedProduct(p); setModalVisible(true); };
  const closeModal = () => { setModalVisible(false); };
  const handleAddToCart = ({ product, qty, size, addons }) => {
    dispatch({ type: 'ADD', payload: { product, qty, size, addons } });
  };
  const quickAdd = (product) => {
    dispatch({ type: 'ADD', payload: { product, qty: 1 } });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header */}
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Our Menu</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <Ionicons name="bag-outline" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={16} color={Colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products…"
              placeholderTextColor={Colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Category tabs */}
      <FlatList
        data={CATEGORIES}
        keyExtractor={i => i.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catTabs}
        contentContainerStyle={styles.catTabsContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.catTab, activeCategory === item.id && styles.catTabActive]}
            onPress={() => setActiveCategory(item.id)}
          >
            <Text style={styles.catTabIcon}>{item.icon}</Text>
            <Text style={[styles.catTabText, activeCategory === item.id && styles.catTabTextActive]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Products */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>No items found</Text>
          <Text style={styles.emptySubText}>Try a different category or search term</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MenuCard item={item} onPress={openProduct} onAdd={quickAdd} />
          )}
        />
      )}

      <ProductModal
        product={selectedProduct}
        visible={modalVisible}
        onClose={closeModal}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
}

const CARD_W = (width - Spacing.base * 2 - Spacing.md) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },

  header: {
    paddingTop: 52,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: Spacing.md,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.white },

  // Search
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radii.full, paddingHorizontal: Spacing.md, height: 44,
    ...Shadows.sm,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },

  // Category tabs
  catTabs: { maxHeight: 58, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  catTabsContent: { paddingHorizontal: Spacing.sm, alignItems: 'center' },
  catTab: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radii.full, marginRight: Spacing.xs, marginVertical: Spacing.sm,
    backgroundColor: Colors.surfaceSecondary,
  },
  catTabActive: { backgroundColor: Colors.primary },
  catTabIcon: { fontSize: 14, marginRight: 4 },
  catTabText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  catTabTextActive: { color: Colors.white },

  // Grid
  grid: { padding: Spacing.base, paddingBottom: 80 },
  gridRow: { justifyContent: 'space-between', marginBottom: Spacing.md },

  // Menu Card
  menuCard: {
    width: CARD_W,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  menuCardImg: { width: '100%', height: 120, resizeMode: 'cover' },
  menuCardInfo: { padding: Spacing.sm },
  menuCardName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  menuCardDesc: { fontSize: 11, color: Colors.textSecondary, lineHeight: 16, marginBottom: 8 },
  menuCardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  menuCardPrice: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  menuAddBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },

  // Empty
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  emptySubText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay },
  modalSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: height * 0.88,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center', marginTop: 12, marginBottom: 4,
  },
  modalImage: { width: '100%', height: 220, resizeMode: 'cover' },
  modalContent: { padding: Spacing.base },
  modalName: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  modalDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.lg },

  // Options
  optionLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.lg },
  optionChip: {
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radii.full, paddingHorizontal: Spacing.md, paddingVertical: 6,
    marginRight: Spacing.sm, marginBottom: Spacing.sm, alignItems: 'center',
  },
  optionChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryFade },
  optionChipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  optionChipPrice: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  optionChipTextActive: { color: Colors.primary },

  // Addons
  addonRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderRadius: Radii.md, borderWidth: 1.5,
    borderColor: Colors.border, marginBottom: Spacing.sm,
  },
  addonRowActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryFade },
  addonCheck: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm,
  },
  addonCheckActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  addonLabel: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  addonPrice: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },

  // Quantity
  qtyRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
    marginBottom: Spacing.xxl,
  },
  qtyBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.sm,
  },
  qtyText: {
    fontSize: 18, fontWeight: '700', color: Colors.textPrimary,
    marginHorizontal: Spacing.lg,
  },

  // Footer
  modalFooter: {
    padding: Spacing.base,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  addToCartBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.full, paddingVertical: 16,
    alignItems: 'center', ...Shadows.md,
  },
  addToCartText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});
