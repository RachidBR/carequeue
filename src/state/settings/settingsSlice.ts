import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppLanguage, SUPPORTED_LANGUAGES } from '@/i18n';

export type SettingsState = {
    language: AppLanguage;
};

const initialState: SettingsState = {
    language: 'fr',
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<AppLanguage>) => {
            if (SUPPORTED_LANGUAGES.includes(action.payload)) {
                state.language = action.payload;
            }
        },
    },
});

export const { setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;
