import { RootState } from './store';
export const selectNotifEnabled = (s: RootState) => s.notifications.enabled;
export const selectFcmToken = (s: RootState) => s.notifications.fcmToken;