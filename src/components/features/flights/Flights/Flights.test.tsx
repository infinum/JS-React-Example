import { MOCKED_URLS, handlerOverrides } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import { modelToJsonApi } from '@datx/jsonapi';
import { flightsFactory } from '__mocks__/factories';
import { axe } from 'jest-axe';
import { HttpResponse, http } from 'msw';
import { render, screen, waitForElementToBeRemoved } from 'test-utils';
import { Flights } from './Flights';

describe('Flights', () => {
	beforeEach(() => {
		server.use(handlerOverrides.activeCurrentSession);
	});

	it('should be accessible', async () => {
		server.use(http.get(MOCKED_URLS.Flights, () => HttpResponse.json({ data: [] }, { status: 200 })));

		const { container } = render(<Flights />);

		await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});

	it('should render loading state', () => {
		server.use(
			http.get(MOCKED_URLS.Flights, () => {
				// @ts-expect-error fix typing in @datx/test-data-factory
				return HttpResponse.json(flightsFactory(5, { map: modelToJsonApi }), { status: 200 });
			})
		);

		render(<Flights />);

		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('should render error state', async () => {
		server.use(http.get(MOCKED_URLS.Flights, () => HttpResponse.json({ error: 'Error' }, { status: 404 })));

		render(<Flights />);

		await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

		expect(screen.getByText('error')).toBeInTheDocument();
	});

	it('should render 10 flights', async () => {
		const flightName = 'Air Force One';

		server.use(
			http.get(MOCKED_URLS.Flights, () => {
				// @ts-expect-error fix typing in @datx/test-data-factory
				const data = flightsFactory(10, { map: modelToJsonApi, overrides: { name: flightName } });

				return HttpResponse.json({ data }, { status: 200 });
			})
		);

		render(<Flights />);

		await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

		expect(screen.getAllByRole('heading', { name: flightName })).toHaveLength(10);
	});
});
