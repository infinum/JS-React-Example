import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

// Add the app's providers here once it has some (e.g. a data-fetching client or theme provider)
const AllTheProviders = ({ children }: { children: ReactNode }) => <>{children}</>;

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
	render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
