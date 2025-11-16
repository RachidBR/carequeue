import notifee, { EventType, AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Linking } from 'react-native';


export async function requestPermissions() {
    await notifee.requestPermission();
    await notifee.createChannel({ id: 'default', name: 'Default', importance: AndroidImportance.DEFAULT });
}


export async function getFcmToken() {
    const token = await messaging().getToken();
    return token;
}


export function startNotificationListeners() {
    // Foreground messages → display local
    const unsubMsg = messaging().onMessage(async remoteMessage => {
        const { title, body } = remoteMessage.notification || {};
        const postId = remoteMessage.data?.postId;
        await notifee.displayNotification({
            title: title || 'New update',
            body: body || 'Tap to view',
            android: { channelId: 'default' },
            data: { postId },
        });
    });


    // Taps on Notifee notifications
    const unsubNotifee = notifee.onForegroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS) {
            const postId = detail.notification?.data?.postId;
            if (postId) Linking.openURL(`carequeue://post/${postId}`);
        }
    });


    // Background taps (headless)
    notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS) {
            const postId = detail.notification?.data?.postId;
            if (postId) Linking.openURL(`carequeue://post/${postId}`);
        }
    });


    // App opened from a background data-only push
    const unsubOpen = messaging().onNotificationOpenedApp(remoteMessage => {
        const postId = remoteMessage?.data?.postId;
        if (postId) Linking.openURL(`carequeue://post/${postId}`);
    });


    return () => { unsubMsg(); unsubNotifee(); unsubOpen(); };
}