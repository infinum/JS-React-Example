import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { SWRConfig } from 'swr';

import theme from '@themes/default';
import { swrComparator as compare } from '../src/utils/swr';

const AllProviders = ({ children }) => {
	return (
		<SWRConfig value={{ compare }}>
			<ChakraProvider theme={theme}>{children}</ChakraProvider>
		</SWRConfig>
	);
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'queries' | 'wrapper'>) =>
	render(ui, { wrapper: AllProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
