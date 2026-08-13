// ─── API Client ──────────────────────────────────────────────────────────────
import axios from 'axios';
import { BASE_URL } from './mockData';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach auth token from AsyncStorage if present
client.interceptors.request.use(async (config) => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const token = await AsyncStorage.getItem('@hafsum_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (_) {}
  return config;
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err?.response?.data ?? err.message)
);

export default client;
