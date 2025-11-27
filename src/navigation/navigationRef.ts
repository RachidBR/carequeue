import { RootStackParamList } from '@/types/navigation';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params as never);
    } else {
        console.log('[Nav] navigationRef not ready yet, ignoring navigate');
    }
}
