import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface NotifState { enabled: boolean; fcmToken: string | null; lastPromptAt?: number }
const initial: NotifState = { enabled: false, fcmToken: null };


const slice = createSlice({
    name: 'notifications',
    initialState: initial,
    reducers: {
        setEnabled(s, a: PayloadAction<boolean>) { s.enabled = a.payload; },
        setFcmToken(s, a: PayloadAction<string | null>) { s.fcmToken = a.payload; },
        setLastPromptAt(s) { s.lastPromptAt = Date.now(); }
    }
});
export const { setEnabled, setFcmToken, setLastPromptAt } = slice.actions;
export default slice.reducer;