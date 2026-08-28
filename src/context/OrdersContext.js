// ─── Orders Context with Cloud Firestore ─────────────────────────────────────
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { triggerOrderNotification } from '../services/notificationService';
import { MOCK_ORDERS } from '../api/mockData';

const OrdersContext = createContext(null);
const ORDERS_KEY = '@hafsum_orders';

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  useEffect(() => {
    // 1. Load locally cached orders first
    AsyncStorage.getItem(ORDERS_KEY)
      .then(raw => {
        if (raw) setOrders(JSON.parse(raw));
      })
      .catch(() => {});

    // 2. Fetch latest orders from Cloud Firestore
    const fetchFirestoreOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('date', 'desc'), limit(20));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteOrders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(remoteOrders);
          await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(remoteOrders));
        }
      } catch (err) {
        console.log('Firestore orders fetch (using cached):', err?.message);
      }
    };

    fetchFirestoreOrders();
  }, []);

  const placeOrder = async ({ items, subtotal, deliveryFee, total, type, address, notes, paymentMethod, customerName, customerPhone, name, phone }) => {
    const orderId = `HFS-${10000 + Math.floor(Math.random() * 90000)}`;
    const finalCustomerName = name || customerName || 'Guest Customer';
    const finalCustomerPhone = phone || customerPhone || '';

    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'received',
      items: items.map(item => ({
        id: item.product?.id || item.id,
        name: item.product?.name || item.name,
        price: item.price || item.size?.price || 0,
        qty: item.qty || 1,
        size: item.size?.label || null,
      })),
      subtotal,
      deliveryFee,
      total,
      type: type || 'delivery',
      address: address || '',
      notes: notes || '',
      paymentMethod: paymentMethod || 'Cash on Delivery',
      customerName: finalCustomerName,
      customerPhone: finalCustomerPhone,
      createdAt: new Date().toISOString(),
    };

    // Update local state and AsyncStorage immediately
    const updated = [newOrder, ...orders];
    setOrders(updated);
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated));

    // Save to Cloud Firestore in background (sanitize undefined fields for Firestore)
    try {
      const cleanOrder = JSON.parse(JSON.stringify(newOrder));
      await addDoc(collection(db, 'orders'), cleanOrder);
      console.log('Order successfully synced to Cloud Firestore:', orderId);
    } catch (e) {
      console.log('Order saved locally (Firestore offline/sync error):', e?.message);
    }

    // Trigger Push / FCM Notification on device
    try {
      await triggerOrderNotification({ orderId, status: 'received', total });
    } catch (notifErr) {
      console.log('Notification trigger error:', notifErr);
    }

    return newOrder;
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);
