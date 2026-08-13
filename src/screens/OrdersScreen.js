// ─── My Orders Screen ─────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, ScrollView, StatusBar, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, Shadows } from '../theme';
import { useOrders } from '../context/OrdersContext';

const STATUS_CONFIG = {
  received:   { label: 'Order Received',       color: Colors.statusReceived,   icon: 'checkmark-circle',      step: 0 },
  confirmed:  { label: 'Order Confirmed',       color: Colors.statusConfirmed,  icon: 'thumbs-up',             step: 1 },
  preparing:  { label: 'Preparing',             color: Colors.statusPreparing,  icon: 'flame',                 step: 2 },
  ready:      { label: 'Ready / Out for Delivery', color: Colors.statusReady,   icon: 'bicycle',               step: 3 },
  completed:  { label: 'Completed',             color: Colors.statusCompleted,  icon: 'bag-check',             step: 4 },
  cancelled:  { label: 'Cancelled',             color: Colors.statusCancelled,  icon: 'close-circle',          step: -1 },
};

const STATUS_STEPS = ['received', 'confirmed', 'preparing', 'ready', 'completed'];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.received;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.color + '22', borderColor: cfg.color }]}>
      <Ionicons name={cfg.icon} size={12} color={cfg.color} style={{ marginRight: 4 }} />
      <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

// ─── Order Progress Bar ───────────────────────────────────────────────────────
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
function OrderDetailModal({ order, visible, onClose }) {
  if (!order) return null;
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.received;
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.detailContainer}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.detailHeader}>
          <SafeAreaView>
            <View style={styles.detailHeaderRow}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.detailHeaderTitle}>Order Details</Text>
              <View style={{ width: 24 }} />
            </View>
            <Text style={styles.detailOrderId}>{order.id}</Text>
            <Text style={styles.detailDate}>{formatDate(order.date)}</Text>
          </SafeAreaView>
        </LinearGradient>

        <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
          {/* Status */}
          <View style={styles.detailCard}>
            <Text style={styles.detailSection}>Order Status</Text>
            <StatusBadge status={order.status} />
            <OrderProgress status={order.status} />
          </View>

          {/* Items */}
          <View style={styles.detailCard}>
            <Text style={styles.detailSection}>Items Ordered</Text>
            {order.items.map((item, i) => (
              <View key={i} style={styles.orderItemRow}>
                <View style={styles.orderItemQtyBadge}>
                  <Text style={styles.orderItemQty}>{item.qty}x</Text>
                </View>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemPrice}>${(item.price * item.qty).toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* Summary */}
          <View style={styles.detailCard}>
            <Text style={styles.detailSection}>Payment Summary</Text>
            <DetailRow label="Subtotal" value={`$${order.subtotal.toFixed(2)}`} />
            <DetailRow
              label="Delivery Fee"
              value={order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}
            />
            <View style={styles.detailDivider} />
            <DetailRow label="Total" value={`$${order.total.toFixed(2)}`} bold />
          </View>

          {/* Delivery info */}
          {order.type === 'delivery' && order.address && (
            <View style={styles.detailCard}>
              <Text style={styles.detailSection}>Delivery Address</Text>
              <View style={styles.addressRow}>
                <Ionicons name="location" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.addressText}>{order.address}</Text>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
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

// ─── Order Card ───────────────────────────────────────────────────────────────
function OrderCard({ order, onPress }) {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.received;
  return (
    <TouchableOpacity style={styles.orderCard} onPress={() => onPress(order)} activeOpacity={0.88}>
      <View style={styles.orderCardTop}>
        <View>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
        </View>
        <StatusBadge status={order.status} />
      </View>

      <View style={styles.orderCardMid}>
        <Text style={styles.orderItems} numberOfLines={2}>
          {order.items.map(i => `${i.qty}x ${i.name}`).join(' · ')}
        </Text>
      </View>

      <View style={styles.orderCardBottom}>
        <View style={styles.orderTypeRow}>
          <Ionicons
            name={order.type === 'delivery' ? 'bicycle-outline' : 'storefront-outline'}
            size={14}
            color={Colors.textMuted}
          />
          <Text style={styles.orderType}>{order.type === 'delivery' ? 'Delivery' : 'Pickup'}</Text>
        </View>
        <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Orders Screen ────────────────────────────────────────────────────────────
export default function OrdersScreen() {
  const { orders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const openOrder = (order) => { setSelectedOrder(order); setDetailVisible(true); };
  const closeDetail = () => setDetailVisible(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <SafeAreaView>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSub}>{orders.length} order{orders.length !== 1 ? 's' : ''}</Text>
        </SafeAreaView>
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
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <OrderCard order={item} onPress={openOrder} />}
        />
      )}

      <OrderDetailModal
        order={selectedOrder}
        visible={detailVisible}
        onClose={closeDetail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    paddingTop: 52, paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

  // Empty
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.lg },
  emptyText: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  emptySubText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },

  // List
  list: { padding: Spacing.base, paddingBottom: 80 },

  // Order Card
  orderCard: {
    backgroundColor: Colors.white, borderRadius: Radii.lg,
    padding: Spacing.base, marginBottom: Spacing.md, ...Shadows.sm,
  },
  orderCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  orderId: { fontSize: 15, fontWeight: '800', color: Colors.primary },
  orderDate: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: Radii.full,
    paddingVertical: 3, paddingHorizontal: 8,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  orderCardMid: { marginBottom: Spacing.sm },
  orderItems: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  orderCardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderTypeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  orderType: { fontSize: 12, color: Colors.textMuted },
  orderTotal: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },

  // Progress
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
    paddingTop: 52, paddingHorizontal: Spacing.base, paddingBottom: Spacing.lg,
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
});
