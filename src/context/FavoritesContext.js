import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext(null);
const FAVORITES_KEY = '@hafsum_favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY)
      .then(raw => { if (raw) setFavorites(JSON.parse(raw)); })
      .catch(() => {});
  }, []);

  const toggleFavorite = async (product) => {
    let updated;
    const isFav = favorites.find(f => f.id === product.id);
    if (isFav) {
      updated = favorites.filter(f => f.id !== product.id);
    } else {
      updated = [...favorites, product];
    }
    setFavorites(updated);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  const isFavorite = (productId) => {
    return !!favorites.find(f => f.id === productId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
