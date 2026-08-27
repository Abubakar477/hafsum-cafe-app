// ─── Home Screen ──────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Shadows } from '../theme';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../components/ToastNotification';
import { PRODUCTS } from '../api/mockData';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCATIONS } from './LocationScreen';

const { width } = Dimensions.get('window');

const PRIMARY = Colors?.primary || '#492760';
const TEXT = '#1A0D2E';
const MUTED = '#6B5F7A';
const WHITE = '#ffffff';

// ─────────────────────────────────────────────────────────────────────────────
// SPECIAL PRODUCT CARD (CLEAN & ELEGANT)
// ─────────────────────────────────────────────────────────────────────────────
function SpecialProductCard({ product, onSelect, isFav, onFav }) {
  const displayPrice = product.slicePrice || product.price;

  return (
    <View style={styles.specialCard}>
      {/* Product Image + Favorite Heart Button */}
      <View style={styles.imageContainer}>
        <Image source={product.image} style={styles.specialImage} resizeMode="cover" />
        <TouchableOpacity style={styles.favBtn} onPress={() => onFav(product)} activeOpacity={0.8}>
          <Ionicons name={isFav ? "heart" : "heart-outline"} size={24} color={isFav ? "#E8445A" : WHITE} />
        </TouchableOpacity>
      </View>

      {/* Product Info & Action Button */}
      <View style={styles.specialContent}>
        <Text style={styles.specialName}>{product.name}</Text>
        <Text style={styles.specialDesc} numberOfLines={2}>{product.description}</Text>

        <View style={styles.cardBottomRow}>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => onSelect(product)}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={20} color={WHITE} />
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIZE & QUANTITY POPUP MODAL
// ─────────────────────────────────────────────────────────────────────────────
function SizeSelectionModal({ visible, product, onClose, onConfirm }) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState('slice'); // 'slice' | 'whole'
  const [qty, setQty] = useState(1);

  // Unit price based on selection
  const unitPrice = selectedSize === 'slice' ? (product.slicePrice || 825) : product.price;
  const totalPrice = unitPrice * qty;

  const handleAdd = () => {
    const sizeObj = selectedSize === 'slice'
      ? { id: 'slice', label: 'Per Slice', price: product.slicePrice || 825 }
      : { id: '2.5lb', label: 'Whole (2.5 lb)', price: product.price };

    onConfirm(product, sizeObj, qty);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.modalSheet}>
          {/* Top Drag Handle */}
          <View style={styles.modalHandle} />

          {/* Modal Header */}
          <View style={styles.modalHeaderRow}>
            <Image source={product.image} style={styles.modalThumb} resizeMode="cover" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.modalTitle} numberOfLines={1}>{product.name}</Text>
              <Text style={styles.modalSubtitle}>Select portion & quantity</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={20} color="#6B5F7A" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalDivider} />

          {/* Size Options Section */}
          <Text style={styles.modalSectionLabel}>Choose Portion Size</Text>

          {/* Option 1: Per Slice */}
          <TouchableOpacity
            style={[styles.sizeCard, selectedSize === 'slice' && styles.sizeCardActive]}
            onPress={() => setSelectedSize('slice')}
            activeOpacity={0.8}
          >
            <View style={styles.sizeCardLeft}>
              <View style={[styles.radioCircle, selectedSize === 'slice' && styles.radioCircleActive]}>
                {selectedSize === 'slice' && <View style={styles.radioDot} />}
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.sizeTitle, selectedSize === 'slice' && styles.sizeTitleActive]}>
                  Per Slice
                </Text>
                <Text style={styles.sizeSub}>Single fresh serving</Text>
              </View>
            </View>
            <Text style={[styles.sizePriceText, selectedSize === 'slice' && styles.sizePriceTextActive]}>
              Rs. {(product.slicePrice || 825).toLocaleString()}
            </Text>
          </TouchableOpacity>

          {/* Option 2: Whole Cake 2.5 lb */}
          <TouchableOpacity
            style={[styles.sizeCard, selectedSize === 'whole' && styles.sizeCardActive]}
            onPress={() => setSelectedSize('whole')}
            activeOpacity={0.8}
          >
            <View style={styles.sizeCardLeft}>
              <View style={[styles.radioCircle, selectedSize === 'whole' && styles.radioCircleActive]}>
                {selectedSize === 'whole' && <View style={styles.radioDot} />}
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.sizeTitle, selectedSize === 'whole' && styles.sizeTitleActive]}>
                  Whole Cake (2.5 lb)
                </Text>
                <Text style={styles.sizeSub}>Full cake for sharing</Text>
              </View>
            </View>
            <Text style={[styles.sizePriceText, selectedSize === 'whole' && styles.sizePriceTextActive]}>
              Rs. {product.price.toLocaleString()}
            </Text>
          </TouchableOpacity>

          {/* Quantity Controls */}
          <View style={styles.qtyRow}>
            <Text style={styles.qtyText}>Quantity</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setQty(q => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={18} color={PRIMARY} />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setQty(q => q + 1)}
              >
                <Ionicons name="add" size={18} color={PRIMARY} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Add to Cart Button */}
          <TouchableOpacity style={styles.modalAddBtn} onPress={handleAdd} activeOpacity={0.88}>
            <LinearGradient
              colors={['#6B3D8A', '#492760']}
              style={styles.modalAddGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="bag-add" size={20} color={WHITE} style={{ marginRight: 8 }} />
              <Text style={styles.modalAddBtnText}>
                Add to Cart • Rs. {totalPrice.toLocaleString()}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
  const { user, updateProfile } = useAuth();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const selectedLocation = user?.location;

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleAddToCart = (product, size, qty) => {
    dispatch({
      type: 'ADD',
      payload: { product, size, qty },
    });
    showToast(`✓ ${product.name} (${size.label}) added to cart!`);
  };

  const handleSelectBranch = async (loc) => {
    try {
      await AsyncStorage.setItem('@hafsum_location', JSON.stringify(loc));
      if (updateProfile) {
        await updateProfile({ location: loc });
      }
      showToast(`📍 Switched to branch: ${loc.area}`);
    } catch (e) {
      console.log('Error changing location:', e);
    } finally {
      setDropdownVisible(false);
    }
  };

  const specialItems = PRODUCTS.filter(p => p.isSpecial);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* FIXED HEADER — Left-Aligned Logo & Right Cart Icon */}
      <LinearGradient
        colors={['#2E1540', '#492760']}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerRow}>
          {/* Left Column containing Location Selector & Logo */}
          <View style={styles.headerLeftCol}>
            {/* Branch Selector Dropdown */}
            <TouchableOpacity
              onPress={() => setDropdownVisible(true)}
              style={styles.dropdownBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="location" size={14} color="#C9963A" style={{ marginRight: 4 }} />
              <Text style={styles.dropdownBtnText}>
                {selectedLocation ? selectedLocation.area : 'Select Branch'}
              </Text>
              <Ionicons name="chevron-down" size={12} color={WHITE} style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            {/* Logo in the Left Corner */}
            <Image
              source={require('../../assets/images/topheaderlogo.jpeg')}
              style={styles.cornerLogo}
              resizeMode="contain"
            />
          </View>

          {/* Cart Icon in the Right Corner */}
          <TouchableOpacity onPress={() => navigation.navigate('Cart')} activeOpacity={0.8}>
            <View style={styles.bagIconWrap}>
              <Ionicons name="bag-outline" size={24} color={WHITE} />
              {itemCount > 0 && <View style={styles.badge} />}
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Custom Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.dropdownModalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownModalCard}>
            <Text style={styles.dropdownModalTitle}>Select Cafe Branch</Text>
            <View style={styles.dropdownModalDivider} />
            {LOCATIONS.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <TouchableOpacity
                  key={loc.id}
                  style={[
                    styles.dropdownModalItem,
                    isSelected && styles.dropdownModalItemSelected,
                  ]}
                  onPress={() => handleSelectBranch(loc)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isSelected ? 'location' : 'location-outline'}
                    size={20}
                    color={isSelected ? '#492760' : '#6B5F7A'}
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.dropdownModalItemText,
                        isSelected && styles.dropdownModalItemTextSelected,
                      ]}
                    >
                      {loc.area}
                    </Text>
                    <Text style={styles.dropdownModalItemSubText}>{loc.address}</Text>
                  </View>
                  {isSelected && (
                    <View style={styles.dropdownCheckCircle}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

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
              onSelect={handleOpenModal}
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

      {/* Pop-up Bottom Sheet for Size & Quantity */}
      <SizeSelectionModal
        visible={modalVisible}
        product={selectedProduct}
        onClose={() => setModalVisible(false)}
        onConfirm={handleAddToCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f4fb' },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    zIndex: 10,
    ...Shadows.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cornerLogo: {
    width: 160,
    height: 60,
  },
  bagIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#E8445A',
    borderWidth: 1.5,
    borderColor: '#492760',
  },
  titleWrap: { alignItems: 'center', marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: TEXT },
  sectionSubtitle: { fontSize: 14, color: MUTED, fontStyle: 'italic', marginTop: 4, textAlign: 'center' },
  content: { padding: 16 },

  // Special Card Styles
  specialCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    ...Shadows.md,
  },
  imageContainer: { position: 'relative' },
  specialImage: { width: '100%', height: 230 },
  favBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialContent: { padding: 18 },
  specialName: { fontSize: 20, fontWeight: '800', color: TEXT, marginBottom: 6 },
  specialDesc: { fontSize: 13, color: MUTED, lineHeight: 19, marginBottom: 16 },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f2ecf8',
  },
  priceLabel: { fontSize: 11, color: MUTED, fontWeight: '600', textTransform: 'uppercase' },
  priceValue: { fontSize: 20, fontWeight: '800', color: PRIMARY, marginTop: 1 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    ...Shadows.sm,
  },
  addBtnText: { color: WHITE, fontSize: 14, fontWeight: '700' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalSheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '85%',
    ...Shadows.lg,
  },
  modalHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalThumb: {
    width: 54,
    height: 54,
    borderRadius: 14,
  },
  modalTitle: { fontSize: 17, fontWeight: '800', color: TEXT },
  modalSubtitle: { fontSize: 12, color: MUTED, marginTop: 2 },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F3E8FF',
    marginVertical: 16,
  },
  modalSectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 12,
  },
  sizeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F6FC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#EFE7F8',
  },
  sizeCardActive: {
    backgroundColor: '#F4EBFC',
    borderColor: PRIMARY,
  },
  sizeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: PRIMARY,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY,
  },
  sizeTitle: { fontSize: 14, fontWeight: '700', color: TEXT },
  sizeTitleActive: { color: PRIMARY },
  sizeSub: { fontSize: 11, color: MUTED, marginTop: 1 },
  sizePriceText: { fontSize: 15, fontWeight: '800', color: TEXT },
  sizePriceTextActive: { color: PRIMARY },

  // Stepper
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 20,
    paddingVertical: 6,
  },
  qtyText: { fontSize: 14, fontWeight: '700', color: TEXT },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 4,
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT,
    paddingHorizontal: 16,
  },

  // Modal Add Button
  modalAddBtn: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  modalAddGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  modalAddBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: WHITE,
  },

  // Favorites Section
  favoritesSection: { marginTop: 5, paddingLeft: 20 },
  favHeader: { marginBottom: 15 },
  favList: { paddingRight: 20 },
  favItem: { width: 80, marginRight: 15, alignItems: 'center' },
  favImage: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: PRIMARY },
  favName: { fontSize: 11, color: TEXT, fontWeight: '600', marginTop: 6, textAlign: 'center' },

  headerLeftCol: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dropdownBtnText: {
    color: WHITE,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  dropdownModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26,13,46,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownModalCard: {
    width: '100%',
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 20,
    ...Shadows.lg,
  },
  dropdownModalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: TEXT,
    marginBottom: 12,
    textAlign: 'center',
  },
  dropdownModalDivider: {
    height: 1,
    backgroundColor: '#F3E8FF',
    marginBottom: 16,
  },
  dropdownModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: '#F9F5FF',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dropdownModalItemSelected: {
    borderColor: '#492760',
    backgroundColor: '#F3E8FF',
  },
  dropdownModalItemText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: TEXT,
  },
  dropdownModalItemTextSelected: {
    color: '#492760',
  },
  dropdownModalItemSubText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: MUTED,
    marginTop: 2,
  },
  dropdownCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#492760',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});