// NOTE: this file is generated with "npm run i18n:generate" command

import 'i18next';

import common from 'public/locales/en-US/common.json';
import flightCard from 'public/locales/en-US/flight-card.json';
import flightListSection from 'public/locales/en-US/flight-list-section.json';
import loginForm from 'public/locales/en-US/login-form.json';
import login from 'public/locales/en-US/login.json';
import mainNavigation from 'public/locales/en-US/main-navigation.json';

declare module 'i18next' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface CustomTypeOptions {
		// custom namespace type if you changed it
		defaultNS: 'common';
		// custom resources type
		resources: {
			common: typeof common;
			['flight-card']: typeof flightCard;
			['flight-list-section']: typeof flightListSection;
			['login-form']: typeof loginForm;
			login: typeof login;
			['main-navigation']: typeof mainNavigation;
		};
	}
}
