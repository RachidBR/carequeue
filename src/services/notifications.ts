// src/services/notifications.ts
import notifee, {
    AndroidImportance,
    AndroidVisibility,
    AuthorizationStatus,
} from '@notifee/react-native';

async function requestNotificationPermissionOnce(): Promise<boolean> {
    // Ask system for notification permission
    const settings = await notifee.requestPermission();

    if (
        settings.authorizationStatus === AuthorizationStatus.DENIED ||
        settings.authorizationStatus === AuthorizationStatus.NOT_DETERMINED
    ) {
        console.log('[Notif] permission denied or not determined:', settings.authorizationStatus);
        return false;
    }

    return true;
}

async function ensureDefaultChannel() {
    // Android-only, but safe to call everywhere
    await notifee.createChannel({
        id: 'default',
        name: 'Default',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
    });
}

export async function notifyNewPost(params: { title: string; body: string }) {
    console.log('[Notif] notifyNewPost called with params:', params);

    // 1) Permission (only blocks the first time)
    const ok = await requestNotificationPermissionOnce();
    console.log('[Notif] permission result:', ok);
    if (!ok) {
        return;
    }

    try {
        // 2) Android: channel
        await ensureDefaultChannel();

        // 3) Show local notification
        const truncatedBody =
            params.body.length > 60 ? params.body.slice(0, 60) + '…' : params.body;

        await notifee.displayNotification({
            title: 'Nouveau post publié',
            body: `${params.title} – ${truncatedBody}`,
            android: {
                channelId: 'default',
                pressAction: {
                    id: 'default',
                },
            },
        });

        console.log('[Notif] notification displayed successfully');
    } catch (error) {
        console.error('[Notif] Error displaying notification:', error);
    }
}
