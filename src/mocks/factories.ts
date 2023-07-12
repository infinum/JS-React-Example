import { createClient } from '@/datx/create-client';
import { Session } from '@/models/Session';
import { User } from '@/models/User';
import { createFactory, oneOf, perBuild, sequence } from '@datx/test-data-factory';

const client = createClient();
const factory = createFactory(client);

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
