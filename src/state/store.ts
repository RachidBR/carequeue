import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import notifications from './slices/notificationsSlice';
import postsReducer from './posts/postsSlice';


export const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth, notifications
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;