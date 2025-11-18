import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    fr: {
        translation: require('./fr.json'),
    },
    en: {
        translation: require('./en.json'),
    },
    de: {
        translation: require('./de.json'),
    },
};

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'fr', // default
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, 
    },
});

export const SUPPORTED_LANGUAGES = ['fr', 'en', 'de'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export default i18n;
