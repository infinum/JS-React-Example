import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en_US.json';
import hr from './locales/hr_HR.json';

i18n.use(initReactI18next).init({
	resources: {
		'en_US': {
			translations: en,
		},
		'hr_HR': {
			translations: hr,
		},
	},
	defaultNS: 'translations',
	lng: 'en_US',
	fallbackLng: 'en_US',
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
