import { sequence } from '@datx/test-data-factory';
import { User } from '@/models/User';
import { factory } from '../factory.setup';

export const userFactory = factory(User, {
	fields: {
		id: sequence(),
		firstName: 'John',
		lastName: 'Doe',
	},
});
