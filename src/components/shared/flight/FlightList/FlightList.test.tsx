import { FlightList } from '@/components/shared/flight/FlightList/FlightList';
import { createClient } from '@/datx/create-client';
import { buildMany, createFactory, sequence } from '@datx/test-data-factory';
import { Flight } from '@/models/Flight';
import { render, screen } from 'test-utils';

const client = createClient();
const factory = createFactory(client);

const flight = factory(Flight, {
	fields: {
		id: sequence(),
		name: 'Air Force One',
		arrivesAt: '2021-01-01T00:00:00.000Z',
		airplaneModel: 'Boeing 747',
		basePrice: '100',
		currentSeatPrice: '100',
		departsAt: '2021-01-01T00:00:00.000Z',
	},
});

describe('FlightList', () => {
	beforeEach(() => {
		factory.reset();
	});

	it('should render flights', () => {
		const data = buildMany(flight, 2);

		render(<FlightList flightList={data} />);

		expect(screen.getAllByText('Air Force One')).toHaveLength(2);
		expect(screen.getAllByText('$100')).toHaveLength(2);
	});
});
