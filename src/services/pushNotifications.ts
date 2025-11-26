import { getApp } from '@react-native-firebase/app';
import {
    getMessaging,
    requestPermission,
    AuthorizationStatus,
    getToken,
    onMessage,
    onNotificationOpenedApp,
    getInitialNotification,
} from '@react-native-firebase/messaging';
import { navigate } from '../navigation/navigationRef';
import { showRemoteFCMNotification } from '@/services/notifications';

// 1) Ask for push permission + get FCM token + set handlers
export async function initFCM() {
    console.log('[FCM] initFCM start');

    const app = getApp();
    const msg = getMessaging(app);

    // permission + token stuff (already good)
    const authStatus = await requestPermission(msg);
    console.log('[FCM] permission status =', authStatus);

    const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
        // same as before...
    }

    try {
        const token = await getToken(msg);
        console.log('[FCM] device token =', token);
    } catch (err) {
        console.warn('[FCM] getToken error:', err);
    }

    // FOREGROUND
    onMessage(msg, async remoteMessage => {
        console.log('[FCM] onMessage (foreground):', remoteMessage);

        const title = remoteMessage.notification?.title ?? 'New message';
        const body = remoteMessage.notification?.body ?? '';

        await showRemoteFCMNotification({ title, body });
    });

    // background / killed handlers (unchanged)
    onNotificationOpenedApp(msg, remoteMessage => {
        console.log('[FCM] onNotificationOpenedApp:', remoteMessage?.data);
        const postId = remoteMessage?.data?.postId;

        if (typeof postId === 'string') {
            navigateToPostFromNotification(postId);
        } else {
            console.log('[FCM] onNotificationOpenedApp: postId is missing or not a string');
        }
    });

    const initialNotification = await getInitialNotification(msg);
    const initialPostId = initialNotification?.data?.postId;

    if (typeof initialPostId === 'string') {
        console.log('[FCM] getInitialNotification with postId:', initialPostId);
        navigateToPostFromNotification(initialPostId);
    } else if (initialNotification) {
        console.log('[FCM] getInitialNotification without usable postId:', initialNotification.data);
    }

    console.log('[FCM] initFCM done');
}

// 2) Function that knows how to navigate into nested tabs/stack
export function navigateToPostFromNotification(postId: string) {
    console.log('[Nav] navigateToPostFromNotification', postId);

    // RootStack: { MainTabs }
    // MainTabs: { PostsTab, SettingsTab }
    // PostsTab -> PostsStack: { PostsList, PostDetail, CreatePost }

    navigate('MainTabs' as any, {
        screen: 'PostsTab',
        params: {
            screen: 'PostDetail',
            params: { id: postId },
        },
    });
}
