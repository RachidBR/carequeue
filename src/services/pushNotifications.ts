import { Platform, Alert } from 'react-native';
import {
    getMessaging,
    requestPermission,
    getToken,
    onMessage,
    onNotificationOpenedApp,
    getInitialNotification,
    AuthorizationStatus,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import notifee from '@notifee/react-native';
import { navigate } from '../navigation/navigationRef';

export async function initFCM() {
    console.log('[FCM] initFCM start');

    const app = getApp();
    const msg = getMessaging(app);

    try {
        const authStatus = await requestPermission(msg);
        console.log('[FCM] permission status =', authStatus);

        const enabled =
            authStatus === AuthorizationStatus.AUTHORIZED ||
            authStatus === AuthorizationStatus.PROVISIONAL;

        if (!enabled && Platform.OS === 'ios') {
            Alert.alert(
                'Notifications désactivées',
                "Tu peux les activer plus tard dans les réglages du téléphone.",
            );
        }

        try {
            const token = await getToken(msg);
            console.log('[FCM] device token =', token);
        } catch (err) {
            console.warn('[FCM] getToken error:', err);
        }

        // FOREGROUND -> show Notifee local notif
        onMessage(msg, async remoteMessage => {
            console.log('[FCM] onMessage (foreground):', remoteMessage);

            const notif = remoteMessage.notification;
            if (!notif) return;

            await notifee.displayNotification({
                title: notif.title ?? 'CareQueue',
                body: notif.body ?? '',
                android: {
                    channelId: 'default',
                    pressAction: { id: 'default' },
                },
            });
        });

        // BACKGROUND TAP
        onNotificationOpenedApp(msg, remoteMessage => {
            console.log('[FCM] onNotificationOpenedApp:', remoteMessage?.data);
            const postId = remoteMessage?.data?.postId;
            if (typeof postId === 'string') {
                navigateToPostFromNotification(postId);
            }
        });

        // COLD START TAP
        const initialNotification = await getInitialNotification(msg);
        const initialPostId = initialNotification?.data?.postId;
        if (typeof initialPostId === 'string') {
            console.log(
                '[FCM] getInitialNotification with postId:',
                initialPostId,
            );
            navigateToPostFromNotification(initialPostId);
        }

        console.log('[FCM] initFCM done');
    } catch (err) {
        console.warn('[FCM] initFCM top-level error:', err);
    }
}

export function navigateToPostFromNotification(postId: string) {
    console.log('[Nav] navigateToPostFromNotification', postId);
    navigate('MainTabs' as any, {
        screen: 'PostsTab',
        params: {
            screen: 'PostDetail',
            params: { id: postId },
        },
    });
}
