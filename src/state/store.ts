import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './posts/postsSlice';
import userReducer from './user/userSlice';

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        user: userReducer,
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
