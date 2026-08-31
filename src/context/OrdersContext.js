// ─── Orders Context ───────────────────────────────────────────────────────────
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_ORDERS } from '../api/mockData';
import { triggerOrderNotification } from '../services/notificationService';
import { db } from '../firebase/config';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const OrdersContext = createContext(null);
const ORDERS_KEY = '@hafsum_orders';

export const STATUS_STEPS = ['received', 'confirmed', 'preparing', 'ready', 'completed'];
export const STATUS_INTERVAL_MS = 10 * 60 * 1000;

export function deriveOrderStatus(order, now = Date.now()) {
  if (!order || order.status === 'cancelled') {
    return { status: 'cancelled', remainingMs: 0, nextStatus: null };
  }

  const placedAt = new Date(order.date).getTime();
  if (Number.isNaN(placedAt)) {
    return { status: order.status || 'received', remainingMs: 0, nextStatus: null };
  }

  const elapsed = Math.max(0, now - placedAt);
  const stepIndex = Math.min(STATUS_STEPS.length - 1, Math.floor(elapsed / STATUS_INTERVAL_MS));
  const status = STATUS_STEPS[stepIndex];
  const isLast = status === 'completed';
  const remainingMs = isLast ? 0 : STATUS_INTERVAL_MS - (elapsed % STATUS_INTERVAL_MS);

  return {
    status,
    remainingMs,
    nextStatus: isLast ? null : STATUS_STEPS[stepIndex + 1],
  };
}

// ─── Sync a single order to Firestore ────────────────────────────────────────
async function syncOrderToFirestore(order) {
  try {
    const cleanOrder = JSON.parse(JSON.stringify(order));
    if (order.id) {
      await setDoc(doc(db, 'orders', order.id), cleanOrder, { merge: true });
    } else {
      await addDoc(collection(db, 'orders'), cleanOrder);
    }
  } catch (e) {
    console.log('Firestore sync note:', e?.message);
  }
}

function applyDerivedStatuses(list, now = Date.now()) {
  const notifications = [];
  const changedOrders = [];
  const next = list.map((order) => {
    const derived = deriveOrderStatus(order, now);
    if (derived.status === order.status) return order;
    const updated = { ...order, status: derived.status };
    notifications.push({ orderId: order.id, status: derived.status, total: order.total });
    changedOrders.push(updated);
    return updated;
  });
  return { next, notifications, changedOrders, changed: changedOrders.length > 0 };
}

export function OrdersProvider({ children }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const ordersRef = useRef(orders);
  const userRef = useRef(user);
  ordersRef.current = orders;
  userRef.current = user;

  const persist = useCallback(async (updated) => {
    ordersRef.current = updated;
    setOrders(updated);
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  }, []);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(ORDERS_KEY)
      .then((raw) => {
        if (cancelled) return;
        const loaded = raw ? JSON.parse(raw) : MOCK_ORDERS;
        const { next, notifications, changed, changedOrders } = applyDerivedStatuses(loaded);
        setOrders(next);
        ordersRef.current = next;
        if (changed) {
          AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(next)).catch(() => {});
          changedOrders.forEach((order) => syncOrderToFirestore(order));
        }
        notifications.forEach((n) => triggerOrderNotification(n));
      })
      .catch(() => {});

    const id = setInterval(() => {
      const { next, notifications, changed, changedOrders } = applyDerivedStatuses(ordersRef.current);
      if (!changed) return;
      persist(next).catch(() => {});
      changedOrders.forEach((order) => syncOrderToFirestore(order));
      notifications.forEach((n) => triggerOrderNotification(n));
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [persist]);

  const placeOrder = async ({
    items, subtotal, deliveryFee, total, type, address, notes,
    paymentMethod, payment, name, phone, branch,
  }) => {
    const orderId = `HFS-${10000 + Math.floor(Math.random() * 90000)}`;
    const currentUser = userRef.current;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'received',
      items,
      subtotal,
      deliveryFee,
      total,
      type,
      address: address || '',
      notes: notes || '',
      paymentMethod: paymentMethod || payment || 'cod',
      customerName: name || currentUser?.name || '',
      customerPhone: phone || currentUser?.phone || '',
      branch: branch || '',
      userId: currentUser?.uid || 'anonymous',
      userEmail: currentUser?.email || '',
      userName: currentUser?.name || name || '',
    };
    const updated = [newOrder, ...ordersRef.current];
    await persist(updated);
    syncOrderToFirestore(newOrder);
    triggerOrderNotification({ orderId, status: 'received', total });
    return newOrder;
  };

  const cancelOrder = useCallback(async (orderId) => {
    const current = ordersRef.current.find((o) => o.id === orderId);
    if (!current || current.status === 'cancelled') return false;

    const { status } = deriveOrderStatus(current);
    if (status !== 'received') return false;

    const cancelledOrder = {
      ...current,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
    };
    const updated = ordersRef.current.map((o) => (o.id === orderId ? cancelledOrder : o));
    ordersRef.current = updated;
    setOrders(updated);
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    await syncOrderToFirestore(cancelledOrder);
    return true;
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, cancelOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);
