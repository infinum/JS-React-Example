import { createClient } from '@/datx/create-client';
import { createJsonapiFactory, sequence } from '@datx/test-data-factory';
import { Flight } from '@/models/Flight';

const client = createClient();
const factory = createJsonapiFactory(client);

export const flightFactory = factory(Flight, {
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