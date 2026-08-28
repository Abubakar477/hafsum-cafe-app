// src/services/notificationService.js
// ─── Firebase Cloud Messaging & Notifications Service ────────────────────────
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@hafsum_push_token';

// Configure how notifications are displayed when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
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

      await AsyncStorage.setItem(TOKEN_KEY, token);

      // Save token to Cloud Firestore
        const tokenId = token.replace(/[^a-zA-Z0-9]/g, '_');
        await setDoc(doc(db, 'push_tokens', tokenId), {
          token,
          userId: userId || 'anonymous',
          platform: Platform.OS,
          updatedAt: new Date().toISOString(),

        if (userId) {
          await setDoc(doc(db, 'users', userId), {
            fcmToken: token,
            pushTokenUpdatedAt: new Date().toISOString(),
        }
      }
    } catch (error) {
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
      title = '🎉 Order Confirmed!';
      body = `Your order #${orderId} for Rs. ${total?.toLocaleString?.() || total} has been received by Hafsum. We are preparing it fresh!`;
    } else if (status === 'preparing') {
      title = '👩‍🍳 Order is Being Prepared';
      body = `Our chefs are handcrafting your order #${orderId} with love.`;
    } else if (status === 'ready') {
      title = '✨ Order Ready!';
      body = `Your Hafsum order #${orderId} is ready for pickup/dispatch.`;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { orderId, status },
        sound: 'default',
      },
    });
  } catch (err) {
    console.log('Notification trigger error:', err?.message);
  }
}
