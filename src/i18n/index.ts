import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import frCommon from './fr.json';
import enCommon from './en.json';
import deCommon from './de.json';

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',

        lng: 'fr',
        fallbackLng: 'en',

        resources: {
            fr: { common: frCommon },
            en: { common: enCommon },
            de: { common: deCommon },
        },

        ns: ['common'],
        defaultNS: 'common',

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;