import { Platform, Alert } from 'react-native';
import {
    getMessaging,
    requestPermission,
    getToken,
    onMessage,
    onNotificationOpenedApp,
    getInitialNotification,
    AuthorizationStatus,
    FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
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

        onMessage(msg, async remoteMessage => {
            console.log('[FCM] onMessage (foreground):', remoteMessage);
            // (optional) call Notifee here to show a banner even in foreground
        });

        onNotificationOpenedApp(
            msg,
            (remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
                console.log('[FCM] onNotificationOpenedApp:', remoteMessage?.data);
                const postId = remoteMessage?.data?.postId;
                if (postId) navigateToPostFromNotification(String(postId));
            },
        );

        const initialNotification = await getInitialNotification(msg);
        if (initialNotification?.data?.postId) {
            console.log(
                '[FCM] getInitialNotification with postId:',
                initialNotification.data.postId,
            );
            navigateToPostFromNotification(String(initialNotification.data.postId));
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
