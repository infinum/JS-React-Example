import { RenderOptions, render as rtlRender } from '@testing-library/react';
import { IntlErrorCode, NextIntlClientProvider } from 'next-intl';
import { ReactElement, ReactNode } from 'react';

const AllProviders = ({ children }: { children: ReactNode }) => {
	return (
		<NextIntlClientProvider
			locale="en"
			onError={(error) => {
				// We're intentionally ignoring missing messages errors because we want to test
				// the keys inside the components, not the actual translations.
				// Without this, we'd get a lot of errors for missing translations in the console.
				if (error.code !== IntlErrorCode.MISSING_MESSAGE) {
					console.error(error);
				}
				// otherwise do nothing
			}}
		>
			{children}
		</NextIntlClientProvider>
	);
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
	rtlRender(ui, { wrapper: AllProviders, ...options });

// re-export every public symbol except `default` from RTL
export * from '@testing-library/react';

// replace RTL's `render` with wrapper-aware one
export { customRender as render };

// add renderServer method for async server components
export async function renderServer<T extends (...args: any[]) => Promise<ReactElement>>(
	comp: T,
	props?: Parameters<T>[0]
) {
	const tree = await comp(props);
	return customRender(tree);
}
