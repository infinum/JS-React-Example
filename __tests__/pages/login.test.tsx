import LoginPage from '@/pages/login';
import { act, render, screen } from 'test-utils';
import mockRouter from 'next-router-mock';
import { GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { axe } from 'jest-axe';
import { getStaticProps } from '@/pages/login';

describe('Login Page', () => {
	it('should statically render', async () => {
		const { locale } = mockRouter;

		const context = {
			params: {
				locale,
			} as ParsedUrlQuery,
		};

		await getStaticProps(context as GetStaticPropsContext);

		render(<LoginPage />);

		expect(screen.getByRole('heading', { name: /heading/i }));
	});

	it('should be accessible', async () => {
		const { locale } = mockRouter;

		const context = {
			params: {
				locale,
			} as ParsedUrlQuery,
		};

		await getStaticProps(context as GetStaticPropsContext);

		const { container } = render(<LoginPage />);

		const results = await act(async () => await axe(container));

		expect(results).toHaveNoViolations();
	});
});
