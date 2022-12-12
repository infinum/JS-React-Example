import { FC, ReactElement, ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { render, RenderOptions, act } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { createFetcher, DatxProvider, useInitialize } from '@datx/swr';

import '@testing-library/jest-dom';

import theme from '@/styles/theme';
import { createClient } from '@/datx/create-client';
import common from '../public/locales/en-US/common.json';

declare global {
	var IS_REACT_ACT_ENVIRONMENT: boolean;
}

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

const AllProviders: FC<IComponentWithChildrenProps> = ({ children }) => {
	const client = useInitialize(createClient);

	return (
		<I18nextProvider i18n={i18n}>
			<DatxProvider client={client}>
				<SWRConfig value={{ provider: () => new Map(), fetcher: createFetcher(client) }}>
					<ChakraProvider theme={theme}>{children}</ChakraProvider>
				</SWRConfig>
			</DatxProvider>
		</I18nextProvider>
	);
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
	render(ui, { wrapper: AllProviders, ...options });

// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
const customAct = (...args: Parameters<typeof act>) => {
	let prev = globalThis.IS_REACT_ACT_ENVIRONMENT;
	globalThis.IS_REACT_ACT_ENVIRONMENT = true;

	const result = act(...args);

	globalThis.IS_REACT_ACT_ENVIRONMENT = prev;

	return result;
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render, customAct as act };
