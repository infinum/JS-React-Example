import { MOCKED_URLS, handlerOverrides } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import { modelToJsonApi } from '@datx/jsonapi';
import { flightsFactory } from '__mocks__/factories';
import { axe } from 'jest-axe';
import { rest } from 'msw';
import { render, screen, waitForElementToBeRemoved } from 'test-utils';
import { Flights } from './Flights';

describe('Flights', () => {
	beforeEach(() => {
		server.use(handlerOverrides.activeCurrentSession);
	});

	it('should be accessible', async () => {
		server.use(
			rest.get(MOCKED_URLS.Flights, (req, res, ctx) => {
				return res(ctx.status(200), ctx.json({ data: [] }));
			})
		);

		const { container } = render(<Flights />);

		await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});

	it('should render loading state', () => {
		server.use(
			rest.get(MOCKED_URLS.Flights, (req, res, ctx) => {
				return res(ctx.status(200), ctx.json(flightsFactory(5, { map: modelToJsonApi })));
			})
		);

		render(<Flights />);

		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('should render error state', async () => {
		server.use(
			rest.get(MOCKED_URLS.Flights, (req, res, ctx) => {
				return res(
					ctx.status(404),
					ctx.json({
						error: 'Error',
					})
				);
			})
		);

		render(<Flights />);

		await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

		expect(screen.getByText('error')).toBeInTheDocument();
	});

	it('should render 10 flights', async () => {
		const flightName = 'Air Force One';

		server.use(
			rest.get(MOCKED_URLS.Flights, (req, res, ctx) => {
				const data = flightsFactory(10, { map: modelToJsonApi, overrides: { name: flightName } });

				return res(
					ctx.status(200),
					ctx.json({
						data,
					})
				);
			})
		);

		render(<Flights />);

		await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

		expect(screen.getAllByRole('heading', { name: flightName })).toHaveLength(10);
	});
});
