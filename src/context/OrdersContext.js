// ─── Orders Context ───────────────────────────────────────────────────────────
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_ORDERS } from '../api/mockData';

const OrdersContext = createContext(null);
const ORDERS_KEY = '@hafsum_orders';

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  useEffect(() => {
    AsyncStorage.getItem(ORDERS_KEY)
      .then(raw => { if (raw) setOrders(JSON.parse(raw)); })
      .catch(() => {});
  }, []);

  const placeOrder = async ({ items, subtotal, deliveryFee, total, type, address, notes, paymentMethod }) => {
    const orderId = `HFS-${10000 + Math.floor(Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'received',
      items,
      subtotal,
      deliveryFee,
      total,
      type,
      address,
      notes,
      paymentMethod,
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return newOrder;
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);
