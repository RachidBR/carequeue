import { createSlice } from '@reduxjs/toolkit';


type User = { id: string; email: string } | null;
const slice = createSlice({
    name: 'auth',
    initialState: { user: null as User },
    reducers: {
        setUser(s, a: { payload: User; type: string }) { s.user = a.payload; },
        signOut(s) { s.user = null; },
    }
});
export const { setUser, signOut } = slice.actions;
export default slice.reducer;