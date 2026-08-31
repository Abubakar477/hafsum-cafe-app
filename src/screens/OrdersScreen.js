// ─── My Orders Screen ─────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, ScrollView, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radii, Shadows } from '../theme';
import { useOrders, deriveOrderStatus } from '../context/OrdersContext';

const STATUS_CONFIG = {
  received:   { label: 'Received',       color: Colors.statusReceived,   icon: 'checkmark-circle',      step: 0 },
  confirmed:  { label: 'Confirmed',      color: Colors.statusConfirmed,  icon: 'thumbs-up',             step: 1 },
  preparing:  { label: 'Preparing',      color: Colors.statusPreparing,  icon: 'flame',                 step: 2 },
  ready:      { label: 'Ready',          color: Colors.statusReady,      icon: 'bicycle',               step: 3 },
  completed:  { label: 'Completed',      color: Colors.statusCompleted,  icon: 'bag-check',             step: 4 },
  cancelled:  { label: 'Cancelled',      color: Colors.statusCancelled,  icon: 'close-circle',          step: -1 },
};

const STATUS_STEPS = ['received', 'confirmed', 'preparing', 'ready', 'completed'];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatCountdown(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function StatusCountdown({ order }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!order) return null;
  const { status, remainingMs, nextStatus } = deriveOrderStatus(order, now);
  if (status === 'received' || status === 'completed' || status === 'cancelled' || !nextStatus) {
    return null;
  }

  const nextLabel = STATUS_CONFIG[nextStatus]?.label ?? nextStatus;

  return (
    <View style={styles.timerCard}>
      <Ionicons name="time-outline" size={18} color={Colors.primary} />
      <View style={{ flex: 1 }}>
        <Text style={styles.timerLabel}>Next status: {nextLabel}</Text>
        <Text style={styles.timerValue}>{formatCountdown(remainingMs)}</Text>
      </View>
    </View>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.received;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.color + '15', borderColor: cfg.color }]}>
      <Ionicons name={cfg.icon} size={14} color={cfg.color} style={{ marginRight: 6 }} />
      <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

// ─── Order Progress Bar (used in Detail Modal) ────────────────────────────────
function OrderProgress({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.received;
  const currentStep = cfg.step;
  if (currentStep < 0) return null;

  return (
    <View style={styles.progressWrap}>
      {STATUS_STEPS.map((s, i) => {
        const done = i <= currentStep;
        return (
          <React.Fragment key={s}>
            <View style={styles.progressStep}>
              <View style={[styles.progressDot, done && { backgroundColor: cfg.color }]}>
                {done && <Ionicons name="checkmark" size={10} color={Colors.white} />}
              </View>
              <Text style={[styles.progressLabel, done && { color: cfg.color }]}>
                {STATUS_STEPS[i].charAt(0).toUpperCase() + STATUS_STEPS[i].slice(1)}
              </Text>
            </View>
            {i < STATUS_STEPS.length - 1 && (
              <View style={[styles.progressLine, i < currentStep && { backgroundColor: cfg.color }]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────
function OrderDetailModal({ orderId, visible, onClose }) {
  const insets = useSafeAreaInsets();
  const { orders, cancelOrder } = useOrders();
  const [now, setNow] = useState(Date.now());
  const [cancelError, setCancelError] = useState('');
  const order = orders.find((o) => o.id === orderId) ?? null;

  useEffect(() => {
    if (!visible) return;
    setCancelError('');
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [visible, orderId]);

  if (!order) return null;

  const liveStatus = deriveOrderStatus(order, now).status;
  const canCancel = liveStatus === 'received' && order.status !== 'cancelled';
  const showCancel = liveStatus !== 'completed' && liveStatus !== 'cancelled';

  const handleCancel = async () => {
    if (!canCancel) return;
    const ok = await cancelOrder(order.id);
    if (!ok) {
      setCancelError('This order has been confirmed and can no longer be cancelled.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.detailContainer}>
        <StatusBar barStyle="light-content" />
        <LinearGradient 
          colors={[Colors.primaryDark, Colors.primary]} 
          style={[styles.detailHeader, { paddingTop: insets.top + 15 }]}
        >
          <View style={styles.detailHeaderRow}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.detailHeaderTitle}>Order Details</Text>
            <View style={{ width: 24 }} />
          </View>
          <Text style={styles.detailOrderId}>{order.id}</Text>
          <Text style={styles.detailDate}>{formatDate(order.date)}</Text>
        </LinearGradient>

        <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.detailCard}>
            <Text style={styles.detailSection}>Order Status</Text>
            <StatusBadge status={liveStatus} />
            <OrderProgress status={liveStatus} />
            <StatusCountdown order={order} />
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailSection}>Items Ordered</Text>
            {order.items.map((item, i) => (
              <View key={i} style={styles.orderItemRow}>
                <View style={styles.orderItemQtyBadge}>
                  <Text style={styles.orderItemQty}>{item.qty}x</Text>
                </View>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemPrice}>Rs. {item.price.toLocaleString()}</Text>
              </View>
            ))}
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailSection}>Payment Summary</Text>
            <DetailRow label="Subtotal" value={`Rs. ${order.subtotal.toLocaleString()}`} />
            <DetailRow
              label="Delivery Fee"
              value={order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee.toLocaleString()}`}
            />
            <View style={styles.detailDivider} />
            <DetailRow label="Total" value={`Rs. ${order.total.toLocaleString()}`} bold />
          </View>

          {order.type === 'delivery' && order.address && (
            <View style={styles.detailCard}>
              <Text style={styles.detailSection}>Delivery Address</Text>
              <View style={styles.addressRow}>
                <Ionicons name="location" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.addressText}>{order.address}</Text>
              </View>
            </View>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>

        {showCancel && (
          <View style={[styles.cancelFooter, { paddingBottom: Math.max(insets.bottom, Spacing.base) }]}>
            {!!cancelError && <Text style={styles.cancelError}>{cancelError}</Text>}
            <TouchableOpacity
              style={[styles.cancelBtn, !canCancel && styles.cancelBtnDisabled]}
              onPress={handleCancel}
              disabled={!canCancel}
              activeOpacity={canCancel ? 0.8 : 1}
            >
              <Ionicons
                name="close-circle-outline"
                size={18}
                color={canCancel ? Colors.statusCancelled : Colors.textMuted}
              />
              <Text style={[styles.cancelBtnText, !canCancel && styles.cancelBtnTextDisabled]}>
                {canCancel ? 'Cancel Order' : 'Cancellation unavailable after confirmation'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

function DetailRow({ label, value, bold }) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, bold && { fontWeight: '700', color: Colors.textPrimary }]}>{label}</Text>
      <Text style={[styles.detailValue, bold && { fontWeight: '700', color: Colors.primary }]}>{value}</Text>
    </View>
  );
}

// ─── Order Card (Redesigned to match request) ────────────────────────────────
function OrderCard({ order, onPress }) {
  const status = deriveOrderStatus(order).status;
  return (
    <TouchableOpacity style={styles.orderCard} onPress={() => onPress(order)} activeOpacity={0.9}>
      <View style={styles.orderCardHeader}>
        <Text style={styles.orderId}>{order.id}</Text>
        <StatusBadge status={status} />
      </View>
      
      <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
      
      <View style={styles.orderItemsContainer}>
        <Text style={styles.orderItems} numberOfLines={2}>
          {order.items.map(i => `${i.qty}x ${i.name}`).join(' · ')}
        </Text>
      </View>

      <View style={styles.orderCardFooter}>
        <View style={styles.orderTypeRow}>
          <Ionicons
            name={order.type === 'delivery' ? 'bicycle-outline' : 'storefront-outline'}
            size={18}
            color={Colors.textMuted}
          />
          <Text style={styles.orderType}>{order.type === 'delivery' ? 'Delivery' : 'Pickup'}</Text>
        </View>
        <Text style={styles.orderTotal}>Rs. {order.total.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Orders Screen ────────────────────────────────────────────────────────────
export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const { orders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const openOrder = (order) => { setSelectedOrder(order); setDetailVisible(true); };
  const closeDetail = () => setDetailVisible(false);

  const TAB_BAR_HEIGHT = 70 + (insets.bottom > 0 ? insets.bottom - 10 : 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* HEADER - Standardized with other tabs */}
      <LinearGradient 
        colors={[Colors.primaryDark, Colors.primary]} 
        style={[styles.header, { paddingTop: insets.top + 15 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>My Orders</Text>
            <Text style={styles.headerSub}>{orders.length} order{orders.length !== 1 ? 's' : ''}</Text>
          </View>
        </View>
      </LinearGradient>

      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubText}>Your order history will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={o => o.id}
          contentContainerStyle={[styles.list, { paddingBottom: TAB_BAR_HEIGHT + 20 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <OrderCard order={item} onPress={openOrder} />}
        />
      )}

      <OrderDetailModal
        orderId={selectedOrder?.id}
        visible={detailVisible}
        onClose={closeDetail}
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
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2, fontWeight: '500' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.lg },
  emptyText: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  emptySubText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },

  list: { padding: Spacing.base },

  // Updated Order Card
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  orderDate: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  orderItemsContainer: {
    marginBottom: Spacing.lg,
  },
  orderItems: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontWeight: '500',
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceSecondary,
    paddingTop: Spacing.md,
  },
  orderTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderType: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  // Badge
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Progress (Detail)
  progressWrap: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginTop: Spacing.md, paddingHorizontal: Spacing.xs,
  },
  progressStep: { alignItems: 'center', width: 52 },
  progressDot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  progressLabel: { fontSize: 9, color: Colors.textMuted, textAlign: 'center' },
  progressLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginTop: 10 },

  // Detail Modal
  detailContainer: { flex: 1, backgroundColor: Colors.offWhite },
  detailHeader: {
    paddingHorizontal: 20, paddingBottom: 25,
  },
  detailHeaderRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: Spacing.md,
  },
  detailHeaderTitle: { fontSize: 20, fontWeight: '800', color: Colors.white },
  detailOrderId: { fontSize: 22, fontWeight: '800', color: Colors.white },
  detailDate: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  detailScroll: { flex: 1 },
  detailCard: {
    backgroundColor: Colors.white, borderRadius: Radii.lg,
    padding: Spacing.base, margin: Spacing.base, marginBottom: 0, ...Shadows.sm,
  },
  detailSection: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  orderItemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  orderItemQtyBadge: {
    backgroundColor: Colors.primaryFade, borderRadius: Radii.sm,
    paddingHorizontal: 6, paddingVertical: 2, marginRight: 8,
  },
  orderItemQty: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  orderItemName: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  orderItemPrice: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontSize: 14, color: Colors.textSecondary },
  detailValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  detailDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 8 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start' },
  addressText: { flex: 1, fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  timerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: Spacing.md,
    backgroundColor: Colors.primaryFade,
    borderRadius: Radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  timerLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  timerValue: { fontSize: 18, fontWeight: '800', color: Colors.primary, marginTop: 2 },
  cancelFooter: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelError: {
    fontSize: 12,
    color: Colors.statusCancelled,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.statusCancelled,
    backgroundColor: Colors.white,
  },
  cancelBtnDisabled: {
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceSecondary,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.statusCancelled,
  },
  cancelBtnTextDisabled: {
    color: Colors.textMuted,
  },
});
