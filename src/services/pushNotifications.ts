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
import notifee, {
    AndroidImportance,
    AndroidVisibility,
    EventType,
} from '@notifee/react-native';
import { navigate } from '@/navigation/navigationRef';

// Deep-link into PostsTab -> PostDetail
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

async function ensureDefaultChannel() {
    if (Platform.OS === 'android') {
        await notifee.createChannel({
            id: 'default',
            name: 'Default',
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
        });
    }
}

export async function initFCM() {
    console.log('[FCM] initFCM start');

    try {
        const app = getApp();
        const msg = getMessaging(app);

        // ---- Permissions (FCM / APNS) ----
        const authStatus = await requestPermission(msg);
        console.log('[FCM] permission status =', authStatus);

        const enabled =
            authStatus === AuthorizationStatus.AUTHORIZED ||
            authStatus === AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            console.log('[FCM] notifications not allowed');
            if (Platform.OS === 'ios') {
                Alert.alert(
                    'Notifications désactivées',
                    "Tu peux les activer plus tard dans les réglages du téléphone.",
                );
            }
        }

        // ---- Device token (for Firebase Console "test message") ----
        try {
            const token = await getToken(msg);
            console.log('[FCM] device token =', token);
            // Paste this token in Firebase Console → Cloud Messaging → "Send test message"
        } catch (err) {
            console.warn('[FCM] getToken error:', err);
        }

        // ---- Foreground FCM -> show Notifee banner ----
        onMessage(
            msg,
            async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
                console.log('[FCM] onMessage (foreground):', remoteMessage);

                await ensureDefaultChannel();

                const title =
                    remoteMessage.notification?.title ?? 'CareQueue';
                const body =
                    remoteMessage.notification?.body ?? '';

                const postId = remoteMessage.data?.postId;

                await notifee.displayNotification({
                    title,
                    body,
                    android: {
                        channelId: 'default',
                        pressAction: {
                            id: 'default',
                        },
                    },
                    // store postId so we can read it when the notification is tapped
                    data: postId ? { postId } : undefined,
                });
            },
        );

        // ---- App opened from background via FCM tap ----
        onNotificationOpenedApp(msg, remoteMessage => {
            console.log('[FCM] onNotificationOpenedApp:', remoteMessage?.data);

            const raw = remoteMessage?.data?.postId;
            const postId = typeof raw === 'string' ? raw : undefined;
            if (postId) {
                navigateToPostFromNotification(postId);
            }
        });

        // ---- App opened from *killed* state via FCM tap ----
        const initialNotification = await getInitialNotification(msg);
        if (initialNotification?.data) {
            console.log(
                '[FCM] getInitialNotification data:',
                initialNotification.data,
            );

            const raw = initialNotification.data.postId;
            const postId = typeof raw === 'string' ? raw : undefined;
            if (postId) {
                navigateToPostFromNotification(postId);
            }
        }

        console.log('[FCM] initFCM done');
    } catch (err) {
        console.warn('[FCM] initFCM top-level error:', err);
    }
}

// ---- Notifee tap → navigate to PostDetail ----
// This handles taps on the local notifications we create in onMessage (foreground).
export function registerNotifeeNavigationHandler() {
    notifee.onForegroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS) {
            const postId = detail.notification?.data?.postId;
            if (postId) {
                navigateToPostFromNotification(String(postId));
            }
        }
    });

    // You *can* also hook into background events if you want:
    notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS) {
            const postId = detail.notification?.data?.postId;
            if (postId) {
                navigateToPostFromNotification(String(postId));
            }
        }
    });
}
