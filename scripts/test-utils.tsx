import { FC, ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import '@testing-library/jest-dom';

import common from '../public/locales/en-US/common.json';

i18n.use(initReactI18next).init({
	lng: 'en-US',
	fallbackLng: 'en-US',
	ns: ['common'],
	defaultNS: 'common',
	resources: { 'en-US': { common } },
});

interface IComponentWithChildrenProps {
	children?: ReactNode;
}

const AllTheProviders: FC<IComponentWithChildrenProps> = ({ children }) => (
	<I18nextProvider i18n={i18n}>
		<SWRConfig value={{ provider: () => new Map() }}>
			{children}
		</SWRConfig>
	</I18nextProvider>
);

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
	render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
