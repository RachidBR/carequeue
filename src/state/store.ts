import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import notifications from './slices/notificationsSlice';


export const store = configureStore({ reducer: { auth, notifications } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;