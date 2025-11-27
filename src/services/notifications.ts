import notifee, {
    AndroidImportance,
    AndroidVisibility,
    EventType,
} from '@notifee/react-native';
import { navigateToPostFromNotification } from './pushNotifications';

let permissionAskedOnce = false;

export async function requestNotificationPermissionOnce() {
    if (permissionAskedOnce) return;
    permissionAskedOnce = true;

  await notifee.requestPermission();
}

async function ensureDefaultChannel() {
    await notifee.createChannel({
        id: 'default',
        name: 'Default',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
    });
}

export async function notifyNewPost(params: {
    id: string;        // NEW
    title: string;
    body: string;
}) {
    const { id, title, body } = params;
    console.log('[Notif] notifyNewPost called with', params);

    await ensureDefaultChannel();

    await notifee.displayNotification({
        title: 'Nouveau post publié',
        body: `${title} – ${body.slice(0, 60)}...`,
        data: {
            postId: id, // <- crucial for deep-link
        },
        android: {
            channelId: 'default',
            pressAction: {
                id: 'default',
            },
        },
    });
}
notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
        const postId = detail.notification?.data?.postId;
        if (postId) {
            console.log('[Notif] foreground press on postId=', postId);
            navigateToPostFromNotification(postId as string);
        }
    }
});
notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
        const postId = detail.notification?.data?.postId;
        if (postId) {
            console.log('[Notif] background press on postId=', postId);
            navigateToPostFromNotification(postId as string);
        }
    }
});
export function initNotifeeNavigationHandlers() {
    // Foreground events (app already open)
    notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS && detail.notification?.data?.postId) {
            const postId = detail.notification.data.postId as string;
            navigateToPostFromNotification(postId);
        }
    });

    // App opened from quit/background via Notifee notification
    notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS && detail.notification?.data?.postId) {
            const postId = detail.notification.data.postId as string;
            navigateToPostFromNotification(postId);
        }
    });
}
