// ─── Cart Context ─────────────────────────────────────────────────────────────
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext(null);

const CART_KEY = '@hafsum_cart';

function cartReducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, items: action.payload };

    case 'ADD': {
      const { product, qty = 1, size, addons = [] } = action.payload;
      const key = `${product.id}_${size?.id ?? 'default'}_${addons.map(a => a.id).join('_')}`;
      const existing = state.items.find(i => i.key === key);
      const unitPrice = (size?.price ?? product.price) + addons.reduce((s, a) => s + a.price, 0);

      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.key === key ? { ...i, qty: i.qty + qty } : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { key, product, qty, size, addons, unitPrice },
        ],
      };
    }

    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map(i =>
          i.key === action.payload ? { ...i, qty: i.qty + 1 } : i
        ),
      };

    case 'DECREMENT':
      return {
        ...state,
        items: state.items
          .map(i => i.key === action.payload ? { ...i, qty: i.qty - 1 } : i)
          .filter(i => i.qty > 0),
      };

    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.key !== action.payload) };

    case 'CLEAR':
      return { ...state, items: [] };

    case 'SET_PROMO':
      return { ...state, promoCode: action.payload, discount: action.discount ?? 0 };

    default:
      return state;
  }
}

const initialState = { items: [], promoCode: '', discount: 0 };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persist cart
  useEffect(() => {
    AsyncStorage.getItem(CART_KEY).then(raw => {
      if (raw) dispatch({ type: 'LOAD', payload: JSON.parse(raw) });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(CART_KEY, JSON.stringify(state.items)).catch(() => {});
  }, [state.items]);

  const subtotal = state.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const deliveryFee = 2.00;
  const total = Math.max(0, subtotal - state.discount) + deliveryFee;
  const itemCount = state.items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ ...state, dispatch, subtotal, deliveryFee, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
