import FlightsPage, { getServerSideProps, FlightsProps } from '@/pages/flights';
import { render, screen } from 'test-utils';
import mockRouter from 'next-router-mock';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { axe } from 'jest-axe';

describe('Flights Page', () => {
	it('should serverside render', async () => {
		const { locale } = mockRouter;

		const context = {
			params: {
				locale,
			} as ParsedUrlQuery,
		};

		const { props } = (await getServerSideProps(context as GetServerSidePropsContext)) as { props: FlightsProps };

		render(<FlightsPage {...props} />);

		expect(screen.getByRole('heading', { name: /title/i }));
	});

	it('should be accessible', async () => {
		const { locale } = mockRouter;

		const context = {
			params: {
				locale,
			} as ParsedUrlQuery,
		};

		const { props } = (await getServerSideProps(context as GetServerSidePropsContext)) as { props: FlightsProps };

		const { container } = render(<FlightsPage {...props} />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});
});
