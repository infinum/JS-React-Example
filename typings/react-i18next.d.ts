// NOTE: this file is generated with "npm run i18n:generate" command

import 'react-i18next';
import common from 'public/locales/en-US/common.json';
import login from 'public/locales/en-US/login.json';
import loginForm from 'public/locales/en-US/loginForm.json';
import mainNavigation from 'public/locales/en-US/mainNavigation.json';

declare module 'react-i18next' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface CustomTypeOptions {
		// custom namespace type if you changed it
		defaultNS: 'common';
		// custom resources type
		resources: {
			common: typeof common;
			login: typeof login;
			loginForm: typeof loginForm;
			mainNavigation: typeof mainNavigation;
		};
	}
}
