import { createClient } from '@/datx/create-client';
import { Company } from '@/models/Company';
import { Flight } from '@/models/Flight';
import { Session } from '@/models/Session';
import { User } from '@/models/User';
import { IBuildConfiguration, buildMany, createFactory, oneOf, perBuild, sequence } from '@datx/test-data-factory';

const client = createClient();
const factory = createFactory(client);

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

export const flightsFactory = (num: number, buildTimeConfig?: IBuildConfiguration<typeof Flight>) =>
	buildMany(flightFactory, num, buildTimeConfig);

export const companyFactory = factory(Company, {
	fields: {
		id: sequence(),
		name: oneOf('Croatia Airlines', 'Lufthansa', 'British Airways'),
	},
});

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
