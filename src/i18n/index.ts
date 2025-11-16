import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './fr.json';
import de from './de.json';
import en from './en.json';


i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'fr',
    fallbackLng: 'en',
    resources: { fr: { translation: fr }, de: { translation: de }, en: { translation: en } },
    interpolation: { escapeValue: false },
});


export default i18n;