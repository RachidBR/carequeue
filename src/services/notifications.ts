import notifee, {
    AndroidImportance,
    AndroidVisibility,
} from '@notifee/react-native';

let permissionAskedOnce = false;

export async function requestNotificationPermissionOnce() {
    if (permissionAskedOnce) return;
    permissionAskedOnce = true;

    const settings = await notifee.requestPermission();
    // you could log / handle DENIED here if you want
}

async function ensureDefaultChannel() {
    await notifee.createChannel({
        id: 'default',
        name: 'Default',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
    });
}

export async function notifyNewPost(params: { title: string; body: string }) {
    console.log('[Notif] notifyNewPost called with params:', params);

    try {
        await ensureDefaultChannel();

        await notifee.displayNotification({
            title: 'Nouveau post publié',
            body: `${params.title} – ${params.body.slice(0, 60)}...`,
            android: {
                channelId: 'default',
                pressAction: { id: 'default' },
            },
        });

        console.log('[Notif] notification displayed');
    } catch (error) {
        console.error('[Notif] error displaying notification:', error);
    }
}
