// src/services/notificationService.js
// ─── Firebase Cloud Messaging & Notifications Service ────────────────────────
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@hafsum_push_token';

// Configure how notifications are displayed when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register device for Push Notifications & FCM
 * Returns the push token and saves it to Firestore.
 */
export async function registerForPushNotificationsAsync(userId = null) {
  let token = null;

  // Set up Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('hafsum-orders', {
      name: 'Hafsum Orders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#492760',
      sound: 'default',
    });
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted.');
      return null;
    }

    // Pass Expo Project ID (from app.json / Constants)
    const projectId = Constants.expoConfig?.extra?.eas?.projectId || 'hafsum-mobile-app';
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId }).catch(() => null);
    token = tokenData?.data || null;

    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);

      // Save token to Cloud Firestore
      const tokenId = token.replace(/[^a-zA-Z0-9]/g, '_');
      await setDoc(doc(db, 'push_tokens', tokenId), {
        token,
        userId: userId || 'anonymous',
        platform: Platform.OS,
        updatedAt: new Date().toISOString(),
      }, { merge: true }).catch(() => {});

      if (userId) {
        await setDoc(doc(db, 'users', userId), {
          fcmToken: token,
          pushTokenUpdatedAt: new Date().toISOString(),
        }, { merge: true }).catch(() => {});
      }
    }
  } catch (error) {
    console.log('Push notification setup note:', error?.message);
  }

  return token;
}

/**
 * Trigger an instant local push notification for order updates
 */
export async function triggerOrderNotification({ orderId, status = 'received', total }) {
  try {
    let title = 'Order Update ☕';
    let body = `Your order #${orderId} is being processed.`;

    if (status === 'received') {
      title = '🎉 Order Received!';
      body = `Your order #${orderId} for Rs. ${total?.toLocaleString?.() || total} has been received by Hafsum.`;
    } else if (status === 'confirmed') {
      title = '👍 Order Confirmed';
      body = `Your order #${orderId} has been confirmed. We'll start preparing it shortly.`;
    } else if (status === 'preparing') {
      title = '👩‍🍳 Order is Being Prepared';
      body = `Our chefs are handcrafting your order #${orderId} with love.`;
    } else if (status === 'ready') {
      title = '✨ Order Ready!';
      body = `Your Hafsum order #${orderId} is ready for pickup/dispatch.`;
    } else if (status === 'completed') {
      title = '☕ Order Completed';
      body = `Your order #${orderId} is complete. Thank you for choosing Hafsum!`;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { orderId, status },
        sound: 'default',
      },
      trigger: null,
    });
  } catch (err) {
    console.log('Notification trigger error:', err?.message);
  }
}
