import { FlightList } from '@/components/shared/flight/FlightList/FlightList';
import { createClient } from '@/datx/create-client';
import { buildMany, createFactory, sequence } from '@/lib/datx-test-data-factory/src';
import { Flight } from '@/models/Flight';
import { render, screen } from 'test-utils';

const client = createClient();
const factory = createFactory(client);

const flight = factory(Flight, {
	fields: {
		id: sequence(),
		name: 'Air Force One',
		//...
	},
});

describe('FlightList', () => {
	beforeEach(() => {
		client.reset();
	});

	it('should render flights', () => {
		const data = buildMany(flight, 2);

		const { asFragment } = render(<FlightList flightList={data} />);

		expect(asFragment()).toMatchSnapshot();
	});
});
