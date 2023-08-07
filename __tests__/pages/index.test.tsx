import Home, { getServerSideProps, HomeProps } from '@/pages';
import { render, screen } from 'test-utils';
import mockRouter from 'next-router-mock';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { axe } from 'jest-axe';

describe('Index Page', () => {
	it('should serverside render', async () => {
		const { locale } = mockRouter;

		const context = {
			params: {
				locale,
			} as ParsedUrlQuery,
		};

		const { props } = (await getServerSideProps(context as GetServerSidePropsContext)) as { props: HomeProps };

		render(<Home {...props} />);

		expect(screen.getByText('Ready to Fly?'));
	});

	it('should be accessible', async () => {
		const { locale } = mockRouter;

		const context = {
			params: {
				locale,
			} as ParsedUrlQuery,
		};

		const { props } = (await getServerSideProps(context as GetServerSidePropsContext)) as { props: HomeProps };

		const { container } = render(<Home {...props} />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});
});
