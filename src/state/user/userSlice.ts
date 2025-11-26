import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserState } from './types';

const initialState: UserState = {
    currentUser: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(
            state,
            action: PayloadAction<{ email: string; displayName?: string }>,
        ) {
            const { email, displayName } = action.payload;
            state.currentUser = {
                id: email.toLowerCase(),
                email,
                displayName: displayName || email.split('@')[0],
            };
        },
        logout(state) {
            state.currentUser = null;
        },
        updateProfile(state, action: PayloadAction<{ displayName?: string }>) {
            if (!state.currentUser) return;
            state.currentUser = { ...state.currentUser, ...action.payload };
        },
    },
});

export const { login, logout, updateProfile } = userSlice.actions;
export default userSlice.reducer;
