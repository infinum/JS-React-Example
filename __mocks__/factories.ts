import { createClient } from '@/datx/create-client';
import { Flight } from '@/models/Flight';
import { Session } from '@/models/Session';
import { User } from '@/models/User';
import { modelToJsonApi } from '@datx/jsonapi';
import { buildMany, createFactory, oneOf, perBuild, sequence } from '@datx/test-data-factory';
import { TEST_FLIGHT_NAME } from '__mocks__/constants';

const client = createClient();
const factory = createFactory(client);

export const flightFactory = factory(Flight, {
	fields: {
		id: sequence(),
		name: TEST_FLIGHT_NAME,
		arrivesAt: '2021-01-01T00:00:00.000Z',
		airplaneModel: 'Boeing 747',
		basePrice: '100',
		currentSeatPrice: '100',
		departsAt: '2021-01-01T00:00:00.000Z',
	},
});

export const flightFactoryJsonApi = factory(Flight, {
	fields: {
		id: sequence(),
		name: TEST_FLIGHT_NAME,
		arrivesAt: '2021-01-01T00:00:00.000Z',
		airplaneModel: 'Boeing 747',
		basePrice: '100',
		currentSeatPrice: '100',
		departsAt: '2021-01-01T00:00:00.000Z',
	},
	postBuild: (flight) => {
		return modelToJsonApi(flight);
	},
});

export const flightsFactory = (num: number) => buildMany(flightFactory, num);

export const flightsFactoryJsonApi = (num: number) => buildMany(flightFactoryJsonApi, num);

export const userFactory = factory(User, {
	fields: {
		id: sequence(),
		firstName: oneOf('Johnny', 'Michael', 'Philip', 'Darius', 'Nieves', 'Christian'),
		lastName: oneOf('Smith', 'Brown', 'Miller'),
	},
});

export const sessionFactory = factory(Session, {
	fields: {
		id: sequence(),
		email: sequence((x) => `user${x}@example.com`),
		user: perBuild(() => userFactory()),
	},
});
