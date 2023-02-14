import { FlightList } from '@/components/shared/flight/FlightList/FlightList';
import { createClient } from '@/datx/create-client';
import { buildMany, createFactory, sequence } from '@/lib/datx-test-data-factory/src';
import { Flight } from '@/models/Flight';
import { render, screen } from 'test-utils';

const client = createClient();
const factory = createFactory(client);

type FlightInstance = InstanceType<typeof Flight>;

type Name = FlightInstance['name'];

const flight = factory(Flight, {
	fields: {
		id: sequence(),
		name: 'jack',
	},
});

describe('FlightList', () => {
	beforeEach(() => {
		client.reset();
	});

	it('should render flights', () => {
		const data = buildMany(flight, 2);

		console.log(data[0].id);
		console.log(data[1].id);

		// const { asFragment } = render(<FlightList flightList={data} />);

		// expect(asFragment()).toMatchSnapshot();
	});
});
