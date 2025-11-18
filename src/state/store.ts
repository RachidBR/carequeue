import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import notifications from './slices/notificationsSlice';
import postsReducer from './posts/postsSlice';
import settingsReducer from './settings/settingsSlice';


export const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth, notifications,
        settings: settingsReducer,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;