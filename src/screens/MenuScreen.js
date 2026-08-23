// ─── Menu Screen ──────────────────────────────────────────────────────────────
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image,
  TextInput, Dimensions, StatusBar, Animated, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Shadows } from '../theme';
import { PRODUCTS, CATEGORIES } from '../api/mockData';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ToastNotification';

const { width } = Dimensions.get('window');
const PRIMARY = Colors?.primary || '#492760';
const WHITE = '#ffffff';
const TEXT = '#1A0D2E';
const MUTED = '#6B5F7A';
const CAT_BAR_HEIGHT = 145;

// ── Size Selection Modal ───────────────────────────────────────────────────────
function SizeModal({ visible, product, onClose, onConfirm }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);

  // Reset when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes ? product.sizes[0] : null);
      setQty(1);
    }
  }, [product]);

  if (!product) return null;

  const hasSizes = product.sizes && product.sizes.length > 0;
  const unitPrice = selectedSize ? selectedSize.price : product.price;
  const total = unitPrice * qty;

  const handleAdd = () => {
    onConfirm(product, selectedSize, qty);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.overlay}>
        <TouchableOpacity style={modal.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={modal.sheet}>
          {/* Handle */}
          <View style={modal.handle} />

          {/* Header Row */}
          <View style={modal.headerRow}>
            <Image source={product.image} style={modal.thumb} resizeMode="cover" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={modal.title} numberOfLines={2}>{product.name}</Text>
              <Text style={modal.sub}>{hasSizes ? 'Choose your size & quantity' : 'Choose quantity'}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={modal.closeBtn}>
              <Ionicons name="close" size={18} color={MUTED} />
            </TouchableOpacity>
          </View>

          <View style={modal.divider} />

          {/* Size Options */}
          {hasSizes && (
            <>
              <Text style={modal.sectionLabel}>Select Size</Text>
              {product.sizes.map((size) => {
                const isActive = selectedSize?.id === size.id;
                return (
                  <TouchableOpacity
                    key={size.id}
                    style={[modal.sizeRow, isActive && modal.sizeRowActive]}
                    onPress={() => setSelectedSize(size)}
                    activeOpacity={0.8}
                  >
                    <View style={modal.sizeLeft}>
                      <View style={[modal.radio, isActive && modal.radioActive]}>
                        {isActive && <View style={modal.radioDot} />}
                      </View>
                      <Text style={[modal.sizeLabel, isActive && modal.sizeLabelActive]}>
                        {size.label}
                      </Text>
                    </View>
                    <Text style={[modal.sizePrice, isActive && modal.sizePriceActive]}>
                      Rs. {size.price.toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {/* Single price if no sizes */}
          {!hasSizes && (
            <View style={modal.singlePriceRow}>
              <Text style={modal.singlePriceLabel}>Price</Text>
              <Text style={modal.singlePrice}>Rs. {product.price.toLocaleString()}</Text>
            </View>
          )}

          {/* Quantity Stepper */}
          <View style={modal.qtyRow}>
            <Text style={modal.qtyLabel}>Quantity</Text>
            <View style={modal.stepper}>
              <TouchableOpacity style={modal.stepBtn} onPress={() => setQty(q => Math.max(1, q - 1))}>
                <Ionicons name="remove" size={18} color={PRIMARY} />
              </TouchableOpacity>
              <Text style={modal.qtyVal}>{qty}</Text>
              <TouchableOpacity style={modal.stepBtn} onPress={() => setQty(q => q + 1)}>
                <Ionicons name="add" size={18} color={PRIMARY} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity style={modal.addBtn} onPress={handleAdd} activeOpacity={0.88}>
            <LinearGradient
              colors={['#6B3D8A', '#492760']}
              style={modal.addGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="bag-add" size={20} color={WHITE} style={{ marginRight: 8 }} />
              <Text style={modal.addText}>Add to Cart • Rs. {total.toLocaleString()}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Menu Card ─────────────────────────────────────────────────────────────────
function MenuCard({ item, onShowSizes, onQuickAdd }) {
  const hasSizes = item.sizes && item.sizes.length > 0;
  return (
    <View style={styles.menuCard}>
      <Image source={item.image} style={styles.menuCardImg} resizeMode="cover" />
      <View style={styles.menuCardInfo}>
        <Text style={styles.menuCardName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.menuCardDesc} numberOfLines={2}>{item.description}</Text>
        <TouchableOpacity
          style={hasSizes ? styles.sizesBtn : styles.addDirectBtn}
          onPress={() => hasSizes ? onShowSizes(item) : onQuickAdd(item)}
          activeOpacity={0.85}
        >
          {hasSizes ? (
            <>
              <Ionicons name="layers-outline" size={14} color={PRIMARY} style={{ marginRight: 4 }} />
              <Text style={styles.sizesBtnText}>Show Sizes</Text>
            </>
          ) : (
            <>
              <Ionicons name="add" size={16} color={WHITE} style={{ marginRight: 3 }} />
              <Text style={styles.addDirectText}>Add</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── MenuScreen ────────────────────────────────────────────────────────────────
export default function MenuScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { dispatch } = useCart();
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // ── Scroll-hide logic ──────────────────────────────────────────────────────
  const catBarY = useRef(new Animated.Value(0)).current;
  const lastY = useRef(0);
  const isHidden = useRef(false);

  const handleScroll = ({ nativeEvent }) => {
    const y = nativeEvent.contentOffset.y;
    const delta = y - lastY.current;
    if (delta > 5 && !isHidden.current && y > 10) {
      isHidden.current = true;
      Animated.timing(catBarY, { toValue: -CAT_BAR_HEIGHT, duration: 220, useNativeDriver: true }).start();
    } else if (delta < -5 && isHidden.current) {
      isHidden.current = false;
      Animated.timing(catBarY, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
    lastY.current = y;
  };

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'all' || p.categoryId === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleShowSizes = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleQuickAdd = (product) => {
    dispatch({ type: 'ADD', payload: { product, qty: 1 } });
    showToast(`✓ ${product.name} added to cart!`);
  };

  const handleConfirmAdd = (product, size, qty) => {
    dispatch({ type: 'ADD', payload: { product, size, qty } });
    const label = size ? size.label : '';
    showToast(`✓ ${product.name}${label ? ` (${label})` : ''} added!`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Fixed Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#2E1540', '#492760']}
          style={[styles.headerGradient, { paddingTop: insets.top + 15 }]}
        >
          <View style={styles.headerTopRow}>
            <Text style={styles.headerTitle}>Our Menu</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <View style={styles.bagIconWrap}>
                <Ionicons name="bag-outline" size={24} color={WHITE} />
              </View>
            </TouchableOpacity>
          </View>
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
        </LinearGradient>
      </View>

      {/* Body */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          numColumns={2}
          contentContainerStyle={[
            styles.grid,
            { paddingTop: CAT_BAR_HEIGHT + 8, paddingBottom: 100 + insets.bottom },
          ]}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <MenuCard
              item={item}
              onShowSizes={handleShowSizes}
              onQuickAdd={handleQuickAdd}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          }
        />

        {/* Floating Category Bar */}
        <Animated.View style={[styles.catBar, { transform: [{ translateY: catBarY }] }]}>
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
        </Animated.View>
      </View>

      {/* Size Modal */}
      <SizeModal
        visible={modalVisible}
        product={selectedProduct}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmAdd}
      />
    </View>
  );
}

const CARD_W = (width - 48) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f4fb' },
  header: { overflow: 'hidden', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerGradient: { paddingHorizontal: 20, paddingBottom: 25 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: WHITE },
  bagIconWrap: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: WHITE, borderRadius: 15,
    paddingHorizontal: 15, height: 50,
    ...Shadows.sm,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: TEXT },

  catBar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    backgroundColor: WHITE, paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: '#f0e8f8',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 4,
  },
  catTabsContent: { paddingHorizontal: 15 },
  catTab: {
    alignItems: 'center', width: 85, marginRight: 12,
    paddingVertical: 10, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee',
    ...Shadows.sm,
  },
  catTabActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  catIconWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#f3eef9', justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  catIconWrapActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  catIcon: { fontSize: 22 },
  catTabText: { fontSize: 11, fontWeight: '700', color: TEXT },
  catTabTextActive: { color: WHITE },

  grid: { padding: 16 },
  gridRow: { justifyContent: 'space-between' },
  menuCard: {
    width: CARD_W, backgroundColor: WHITE,
    borderRadius: 20, marginBottom: 16,
    overflow: 'hidden', ...Shadows.sm,
  },
  menuCardImg: { width: '100%', height: 120 },
  menuCardInfo: { padding: 12 },
  menuCardName: { fontSize: 14, fontWeight: '800', color: TEXT, marginBottom: 4 },
  menuCardDesc: { fontSize: 11, color: MUTED, lineHeight: 15, marginBottom: 10 },

  // Show Sizes button (purple outline)
  sizesBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 20,
    paddingVertical: 6, paddingHorizontal: 10,
  },
  sizesBtnText: { fontSize: 12, fontWeight: '700', color: PRIMARY },

  // Direct add button (no sizes)
  addDirectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: PRIMARY, borderRadius: 20,
    paddingVertical: 6, paddingHorizontal: 12,
  },
  addDirectText: { fontSize: 12, fontWeight: '700', color: WHITE },

  empty: { flex: 1, alignItems: 'center', padding: 40 },
  emptyText: { color: MUTED, fontSize: 16 },
});

// ── Modal Styles ───────────────────────────────────────────────────────────────
const modal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    backgroundColor: WHITE, borderTopLeftRadius: 30, borderTopRightRadius: 30,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32,
  },
  handle: {
    width: 44, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB',
    alignSelf: 'center', marginBottom: 18,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  thumb: { width: 54, height: 54, borderRadius: 14 },
  title: { fontSize: 16, fontWeight: '800', color: TEXT },
  sub: { fontSize: 12, color: MUTED, marginTop: 2 },
  closeBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
  },
  divider: { height: 1, backgroundColor: '#F0E8FF', marginVertical: 14 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: TEXT, marginBottom: 10 },

  sizeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F9F6FC', borderRadius: 14, padding: 14, marginBottom: 8,
    borderWidth: 1.5, borderColor: '#EDE7F6',
  },
  sizeRowActive: { borderColor: PRIMARY, backgroundColor: '#F4EBFC' },
  sizeLeft: { flexDirection: 'row', alignItems: 'center' },
  radio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  radioActive: { borderColor: PRIMARY },
  radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: PRIMARY },
  sizeLabel: { fontSize: 14, fontWeight: '600', color: TEXT },
  sizeLabelActive: { color: PRIMARY, fontWeight: '700' },
  sizePrice: { fontSize: 15, fontWeight: '800', color: TEXT },
  sizePriceActive: { color: PRIMARY },

  singlePriceRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F9F6FC', borderRadius: 14, padding: 14, marginBottom: 8,
  },
  singlePriceLabel: { fontSize: 14, color: MUTED, fontWeight: '600' },
  singlePrice: { fontSize: 18, fontWeight: '800', color: PRIMARY },

  qtyRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 14,
  },
  qtyLabel: { fontSize: 14, fontWeight: '700', color: TEXT },
  stepper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 16, padding: 4,
  },
  stepBtn: {
    width: 34, height: 34, borderRadius: 12,
    backgroundColor: WHITE, justifyContent: 'center', alignItems: 'center',
    ...Shadows.sm,
  },
  qtyVal: { fontSize: 16, fontWeight: '800', color: TEXT, paddingHorizontal: 16 },

  addBtn: { borderRadius: 18, overflow: 'hidden' },
  addGrad: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 15,
  },
  addText: { fontSize: 16, fontWeight: '800', color: WHITE },
});
