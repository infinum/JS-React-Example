import { sequence } from '@datx/test-data-factory';
import { Session } from '@/models/Session';
import { factory } from '../factory.setup';
import { userFactory } from '__factories__/user';

export const sessionFactory = factory(Session, {
	fields: {
		id: sequence(),
		user: userFactory(),
	},
});
