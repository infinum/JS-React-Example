import { axe } from 'jest-axe';
import { render, screen, waitForElementToBeRemoved } from 'test-utils';
import { Flights } from './Flights';
import { server } from '@/mocks/server';
import { rest } from 'msw';
import { MOCKED_URLS, handlerOverrides } from '@/mocks/handlers';
import { flightsFactoryJsonApi } from '__mocks__/factories';
import { TEST_FLIGHT_NAME } from '__mocks__/constants';

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
				return res(ctx.status(200), ctx.json(flightsFactoryJsonApi(5)));
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
		server.use(
			rest.get(MOCKED_URLS.Flights, (req, res, ctx) => {
				const data = flightsFactoryJsonApi(10);

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

		expect(screen.getAllByRole('heading', { name: TEST_FLIGHT_NAME })).toHaveLength(10);
	});
});
