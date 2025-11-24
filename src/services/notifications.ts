import notifee, {
    AndroidImportance,
    AndroidVisibility,
    AuthorizationStatus,
} from '@notifee/react-native';

export async function requestNotificationPermission() {
    try {
        const settings = await notifee.requestPermission();

        if (
            settings.authorizationStatus === AuthorizationStatus.DENIED ||
            settings.authorizationStatus === AuthorizationStatus.NOT_DETERMINED
        ) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
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
    console.log('[Notif] otifyNewPost called with params:', params);

    try {
        await ensureDefaultChannel();

        await notifee.displayNotification({
            title: 'Nouveau post publié',
            body: `${params.title} – ${params.body.slice(0, 60)}...`,
            android: {
                channelId: 'default',
                pressAction: { id: 'default' },
            },
            ios: {
                foregroundPresentationOptions: {
                    alert: true,
                    badge: true,
                    sound: true,
                },
            },
        });

    } catch (error) {
    }
}
