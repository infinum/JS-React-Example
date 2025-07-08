import '@testing-library/jest-dom';

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

const locale = 'en';

useRouter.mockImplementationOnce(() => ({
	query: { locale: locale },
}));

jest.mock('next-intl/server', () => ({
	getTranslations: (namespace: string) =>
		// return a Promise that resolves to a function t(key) => `${namespace}.${key}`
		Promise.resolve((key: string) => `${namespace}.${key}`),
}));

jest.mock('next/link', () => ({
	__esModule: true,
	default: ({ href, children, ...props }: any) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));
