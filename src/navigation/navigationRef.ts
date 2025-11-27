import {
    createNavigationContainerRef,
} from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// --- Pending navigation (for when app not ready yet) ---

type PendingNavigation =
    | { type: 'post'; postId: string }
    | null;

let pendingNavigation: PendingNavigation = null;



let pendingActions: Array<() => void> = [];



export function flushNavigationQueue() {
    if (!navigationRef.isReady()) return;
    pendingActions.forEach(fn => fn());
    pendingActions = [];
}
// Generic navigate helper (still used in some places)
export function navigate(name: any, params?: any) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    } else {
        console.log('[Nav] navigationRef not ready yet, ignoring navigate');
    }
}

// Called from FCM / Notifee when a push says "open post X"
export function navigateToPostFromNotification(postId: string | object) {
    // FCM sometimes sends weird types → normalize
    const id =
        typeof postId === 'string'
            ? postId
            : String((postId as any)?.id ?? '');

    if (!id) {
        console.log('[Nav] no valid postId in notification payload', postId);
        return;
    }

    if (navigationRef.isReady()) {
        console.log('[Nav] navigating immediately to post', id);
        navigationRef.navigate(
            'MainTabs',
            {
                screen: 'PostsTab',
                params: {
                    screen: 'PostDetail',
                    params: { id },
                },
            } as never,
        );
    } else {
        console.log('[Nav] queue navigation to post', id);
        pendingNavigation = { type: 'post', postId: id };
    }
}

export function flushPendingNotificationNavigation() {
    if (!pendingNavigation) return;
    if (!navigationRef.isReady()) return;

    if (pendingNavigation.type === 'post') {
        const { postId } = pendingNavigation;
        console.log('[Nav] flushing queued nav to post', postId);

        navigationRef.navigate(
            'MainTabs',
            {
                screen: 'PostsTab',
                params: {
                    screen: 'PostDetail',
                    params: { id: postId },
                },
            } as never,
        );
    }

    pendingNavigation = null;
}



