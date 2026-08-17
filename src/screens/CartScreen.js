// ─── Cart Screen ──────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image,
  TextInput, Modal, ScrollView, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radii, Shadows } from '../theme';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { BRANCHES } from '../api/mockData';

const PAYMENT_METHODS = [
  { id: 'cod',    label: 'Cash on Delivery / Pickup', icon: '💵' },
  { id: 'card',   label: 'Credit / Debit Card',        icon: '💳' },
  { id: 'apple',  label: 'Apple Pay',                   icon: '🍎' },
];

// ─── Checkout Modal ───────────────────────────────────────────────────────────
function CheckoutModal({ visible, onClose, onConfirm, total, deliveryFee }) {
  const insets = useSafeAreaInsets();
  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [address, setAddress]     = useState('');
  const [notes, setNotes]         = useState('');
  const [type, setType]           = useState('delivery'); 
  const [payment, setPayment]     = useState('cod');
  const [branch, setBranch]       = useState(BRANCHES[0].id);

  const valid = name.trim() && phone.trim() && (type === 'pickup' || address.trim());

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.checkoutContainer}>
        <StatusBar barStyle="light-content" />
        <LinearGradient 
          colors={[Colors.primaryDark, Colors.primary]} 
          style={[styles.header, { paddingTop: insets.top + 15 }]}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.checkoutTitle}>Checkout</Text>
            <View style={{ width: 24 }} />
          </View>
        </LinearGradient>

        <ScrollView style={styles.checkoutScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.section}>Order Type</Text>
          <View style={styles.toggleRow}>
            {['delivery', 'pickup'].map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.toggleBtn, type === t && styles.toggleBtnActive]}
                onPress={() => setType(t)}
              >
                <Ionicons
                  name={t === 'delivery' ? 'bicycle' : 'storefront'}
                  size={18}
                  color={type === t ? Colors.white : Colors.textSecondary}
                />
                <Text style={[styles.toggleText, type === t && styles.toggleTextActive]}>
                  {t === 'delivery' ? 'Delivery' : 'Pickup'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.section}>Your Details</Text>
          <Field label="Full Name *" value={name} onChangeText={setName} placeholder="e.g. Ali Ahmed" />
          <Field label="Mobile Number *" value={phone} onChangeText={setPhone} placeholder="03XX XXXXXXX" keyboardType="phone-pad" />

          {type === 'delivery' && (
            <Field label="Delivery Address *" value={address} onChangeText={setAddress} placeholder="Street, Phase, Area" multiline />
          )}

          {type === 'pickup' && (
            <>
              <Text style={styles.fieldLabel}>Select Branch</Text>
              {BRANCHES.map(b => (
                <TouchableOpacity
                  key={b.id}
                  style={[styles.branchCard, branch === b.id && styles.branchCardActive]}
                  onPress={() => setBranch(b.id)}
                >
                  <View style={[styles.branchRadio, branch === b.id && styles.branchRadioActive]}>
                    {branch === b.id && <View style={styles.branchRadioDot} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.branchName}>{b.name}</Text>
                    <Text style={styles.branchAddr}>{b.address}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          <Field label="Order Notes (optional)" value={notes} onChangeText={setNotes} placeholder="Any special requests?" multiline />

          <Text style={styles.section}>Payment Method</Text>
          {PAYMENT_METHODS.map(pm => (
            <TouchableOpacity
              key={pm.id}
              style={[styles.payRow, payment === pm.id && styles.payRowActive]}
              onPress={() => setPayment(pm.id)}
            >
              <Text style={styles.payIcon}>{pm.icon}</Text>
              <Text style={[styles.payLabel, payment === pm.id && styles.payLabelActive]}>{pm.label}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.section}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <SummaryRow label="Subtotal" value={`Rs. ${(total - (type === 'delivery' ? deliveryFee : 0)).toLocaleString()}`} />
            {type === 'delivery' && <SummaryRow label="Delivery Fee" value={`Rs. ${deliveryFee.toLocaleString()}`} />}
            {type === 'pickup' && <SummaryRow label="Delivery Fee" value="FREE" accent />}
            <View style={styles.summaryDivider} />
            <SummaryRow
              label="Total"
              value={`Rs. ${type === 'delivery' ? total.toLocaleString() : (total - deliveryFee).toLocaleString()}`}
              bold
            />
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={[styles.checkoutFooter, { paddingBottom: Math.max(insets.bottom, Spacing.base) }]}>
          <TouchableOpacity
            style={[styles.confirmBtn, !valid && styles.confirmBtnDisabled]}
            onPress={() => valid && onConfirm({ name, phone, address, notes, type, payment, branch })}
            disabled={!valid}
          >
            <Text style={styles.confirmText}>
              Place Order · Rs. {type === 'delivery' ? total.toLocaleString() : (total - deliveryFee).toLocaleString()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType, multiline }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.field, multiline && styles.fieldMulti]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );
}

function SummaryRow({ label, value, bold, accent }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, bold && { fontWeight: '700', color: Colors.textPrimary }]}>{label}</Text>
      <Text style={[styles.summaryValue, bold && { fontWeight: '700', color: Colors.primary }, accent && { color: Colors.success }]}>{value}</Text>
    </View>
  );
}

// ─── Order Confirmation Modal ─────────────────────────────────────────────────
function ConfirmationModal({ visible, order, onClose }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.confirmOverlay}>
        <View style={styles.confirmCard}>
          <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.confirmHeader}>
            <Text style={styles.confirmIcon}>🎉</Text>
            <Text style={styles.confirmTitle}>Order Placed!</Text>
          </LinearGradient>

          <View style={styles.confirmBody}>
            <View style={styles.orderIdBadge}>
              <Text style={styles.orderIdLabel}>Order Number</Text>
              <Text style={styles.orderId}>{order?.id}</Text>
            </View>
            <Text style={styles.confirmMsg}>
              Your order has been received successfully.{'\n'}We'll start preparing it right away!
            </Text>
            <TouchableOpacity 
              style={[styles.doneBtn, { marginBottom: Math.max(insets.bottom, 0) }]} 
              onPress={onClose}
            >
              <Text style={styles.doneBtnText}>Track Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Cart Item Row ────────────────────────────────────────────────────────────
function CartItem({ item, dispatch }) {
  return (
    <View style={styles.cartItem}>
      <Image source={typeof item.product.image === 'string' ? { uri: item.product.image } : item.product.image} style={styles.cartItemImg} />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName} numberOfLines={1}>{item.product.name}</Text>
        {item.size && <Text style={styles.cartItemMeta}>{item.size.label}</Text>}
        {item.addons?.length > 0 && (
          <Text style={styles.cartItemMeta}>{item.addons.map(a => a.label).join(', ')}</Text>
        )}
        <Text style={styles.cartItemPrice}>Rs. {(item.unitPrice * item.qty).toLocaleString()}</Text>
      </View>
      <View style={styles.cartQty}>
        <TouchableOpacity
          style={styles.cartQtyBtn}
          onPress={() => dispatch({ type: 'DECREMENT', payload: item.key })}
        >
          <Ionicons name="remove" size={14} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.cartQtyText}>{item.qty}</Text>
        <TouchableOpacity
          style={styles.cartQtyBtn}
          onPress={() => dispatch({ type: 'INCREMENT', payload: item.key })}
        >
          <Ionicons name="add" size={14} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Cart Screen ──────────────────────────────────────────────────────────────
export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { items, dispatch, subtotal, deliveryFee, total } = useCart();
  const { placeOrder } = useOrders();
  const [promo, setPromo] = useState('');
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleConfirm = async (details) => {
    const orderItems = items.map(i => ({
      name: i.product.name,
      qty: i.qty,
      price: i.unitPrice,
    }));
    const fee = details.type === 'delivery' ? deliveryFee : 0;
    const order = await placeOrder({
      items: orderItems,
      subtotal,
      deliveryFee: fee,
      total: subtotal + fee,
      ...details,
    });
    dispatch({ type: 'CLEAR' });
    setCheckoutVisible(false);
    setConfirmOrder(order);
    setConfirmVisible(true);
  };

  const handleDone = () => {
    setConfirmVisible(false);
    navigation.navigate('Orders');
  };

  const TAB_BAR_HEIGHT = 70 + (insets.bottom > 0 ? insets.bottom - 10 : 0);

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient 
          colors={[Colors.primaryDark, Colors.primary]} 
          style={[styles.header, { paddingTop: insets.top + 15 }]}
        >
          <Text style={styles.headerTitle}>My Cart</Text>
        </LinearGradient>
        <View style={styles.emptyCart}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Menu')}>
            <Text style={styles.shopBtnText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient 
        colors={[Colors.primaryDark, Colors.primary]} 
        style={[styles.header, { paddingTop: insets.top + 15 }]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>My Cart</Text>
          <TouchableOpacity onPress={() => dispatch({ type: 'CLEAR' })}>
            <Text style={styles.clearBtn}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        data={items}
        keyExtractor={i => i.key}
        contentContainerStyle={[styles.list, { paddingBottom: 110 + TAB_BAR_HEIGHT }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <CartItem item={item} dispatch={dispatch} />}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <View style={styles.promoWrap}>
              <TextInput
                style={styles.promoInput}
                placeholder="Promo code"
                placeholderTextColor={Colors.textMuted}
                value={promo}
                onChangeText={setPromo}
              />
              <TouchableOpacity style={styles.promoApply}>
                <Text style={styles.promoApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.totalsCard}>
              <SummaryRow label="Subtotal" value={`Rs. ${subtotal.toLocaleString()}`} />
              <SummaryRow label="Delivery Fee" value={`Rs. ${deliveryFee.toLocaleString()}`} />
              <View style={styles.summaryDivider} />
              <SummaryRow label="Total" value={`Rs. ${total.toLocaleString()}`} bold />
            </View>
          </View>
        )}
      />

      <View style={[styles.checkoutBar, { bottom: TAB_BAR_HEIGHT + 15 }]}>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => setCheckoutVisible(true)}>
          <Text style={styles.checkoutBtnText}>Proceed to Checkout · Rs. {total.toLocaleString()}</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <CheckoutModal
        visible={checkoutVisible}
        onClose={() => setCheckoutVisible(false)}
        onConfirm={handleConfirm}
        total={total}
        deliveryFee={deliveryFee}
      />

      <ConfirmationModal
        visible={confirmVisible}
        order={confirmOrder}
        onClose={handleDone}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    paddingHorizontal: 20, paddingBottom: 25,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.white },
  clearBtn: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  emptyCart: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.lg },
  emptyText: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 20 },
  shopBtn: { backgroundColor: Colors.primary, borderRadius: Radii.full, paddingVertical: 14, paddingHorizontal: 32 },
  shopBtnText: { color: Colors.white, fontWeight: '700' },
  list: { padding: Spacing.base },
  cartItem: {
    backgroundColor: Colors.white, borderRadius: Radii.lg, flexDirection: 'row',
    alignItems: 'center', padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm,
  },
  cartItemImg: { width: 70, height: 70, borderRadius: Radii.md, marginRight: Spacing.md },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  cartItemMeta: { fontSize: 12, color: Colors.textSecondary, marginBottom: 1 },
  cartItemPrice: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginTop: 4 },
  cartQty: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceSecondary, borderRadius: Radii.full, padding: 4 },
  cartQtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  cartQtyText: { fontSize: 14, fontWeight: '700', marginHorizontal: 10 },
  footer: { marginTop: Spacing.md },
  promoWrap: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderRadius: Radii.lg, overflow: 'hidden', marginBottom: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  promoInput: { flex: 1, padding: Spacing.md, fontSize: 14 },
  promoApply: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, justifyContent: 'center' },
  promoApplyText: { color: Colors.white, fontWeight: '700' },
  totalsCard: { backgroundColor: Colors.white, borderRadius: Radii.lg, padding: Spacing.base, ...Shadows.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  summaryDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 8 },
  checkoutBar: {
    position: 'absolute', left: 0, right: 0,
    paddingHorizontal: Spacing.base,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary, borderRadius: Radii.full,
    paddingVertical: 18, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', ...Shadows.lg,
  },
  checkoutBtnText: { color: Colors.white, fontWeight: '800', fontSize: 16, marginRight: 10 },
  checkoutContainer: { flex: 1, backgroundColor: Colors.offWhite },
  checkoutHeader: { paddingHorizontal: 20, paddingBottom: 25 },
  checkoutHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  checkoutTitle: { fontSize: 20, fontWeight: '800', color: Colors.white },
  checkoutScroll: { flex: 1 },
  section: { fontSize: 16, fontWeight: '700', marginTop: Spacing.xl, marginBottom: Spacing.sm, marginHorizontal: Spacing.base },
  toggleRow: { flexDirection: 'row', paddingHorizontal: Spacing.base, gap: Spacing.md },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: Radii.lg, borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.white },
  toggleBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  toggleText: { fontSize: 14, fontWeight: '600', marginLeft: 6 },
  toggleTextActive: { color: Colors.white },
  fieldWrap: { paddingHorizontal: Spacing.base, marginBottom: Spacing.md },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  field: { backgroundColor: Colors.white, borderRadius: Radii.md, borderWidth: 1.5, borderColor: Colors.border, padding: Spacing.md },
  fieldMulti: { height: 80, textAlignVertical: 'top' },
  branchCard: { flexDirection: 'row', padding: Spacing.md, marginHorizontal: Spacing.base, marginBottom: Spacing.sm, backgroundColor: Colors.white, borderRadius: Radii.md, borderWidth: 1.5, borderColor: Colors.border },
  branchCardActive: { borderColor: Colors.primary },
  branchRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  branchRadioActive: { borderColor: Colors.primary },
  branchRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  branchName: { fontWeight: '700' },
  branchAddr: { fontSize: 12, color: Colors.textSecondary },
  payRow: { flexDirection: 'row', padding: Spacing.md, marginHorizontal: Spacing.base, marginBottom: Spacing.sm, backgroundColor: Colors.white, borderRadius: Radii.md, borderWidth: 1.5, borderColor: Colors.border },
  payRowActive: { borderColor: Colors.primary },
  payIcon: { fontSize: 20, marginRight: 10 },
  payLabel: { flex: 1, fontWeight: '600' },
  summaryCard: { backgroundColor: Colors.white, borderRadius: Radii.lg, padding: Spacing.base, marginHorizontal: Spacing.base, ...Shadows.sm },
  checkoutFooter: { padding: Spacing.base, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  confirmBtn: { backgroundColor: Colors.primary, borderRadius: Radii.full, paddingVertical: 16, alignItems: 'center' },
  confirmBtnDisabled: { backgroundColor: Colors.textMuted },
  confirmText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  confirmOverlay: { flex: 1, backgroundColor: Colors.overlay, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  confirmCard: { backgroundColor: Colors.white, borderRadius: 24, overflow: 'hidden', width: '100%' },
  confirmHeader: { padding: Spacing.xl, alignItems: 'center' },
  confirmIcon: { fontSize: 52 },
  confirmTitle: { fontSize: 24, fontWeight: '800', color: Colors.white },
  confirmBody: { padding: Spacing.xl, alignItems: 'center' },
  orderIdBadge: { backgroundColor: Colors.primaryFade, borderRadius: Radii.lg, padding: Spacing.md, alignItems: 'center', marginBottom: Spacing.lg, width: '100%' },
  orderIdLabel: { fontSize: 12, color: Colors.textSecondary },
  orderId: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  confirmMsg: { textAlign: 'center', color: Colors.textSecondary, marginBottom: Spacing.xl },
  doneBtn: { backgroundColor: Colors.primary, borderRadius: Radii.full, paddingVertical: 14, paddingHorizontal: 40 },
  doneBtnText: { color: Colors.white, fontWeight: '700' },
});
