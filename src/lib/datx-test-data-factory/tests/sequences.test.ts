import { createTestClient } from './create-test-client';
import { createFactory, sequence } from '../src';
import { User } from './models/User';

const client = createTestClient();
const factory = createFactory(client);

describe('sequences', () => {
	beforeEach(() => {
		client.reset();
	});

	it('should increment sequence per build', () => {
		const userFactory = factory(User, {
			fields: {
				id: sequence(),
			},
		});

		const user1 = userFactory();
		const user2 = userFactory();

		expect(user1.id).toBe(1);
		expect(user2.id).toBe(2);
	});

	it('should accept function that returns a string', () => {
		const userFactory = factory(User, {
			fields: {
				email: sequence((n) => `datx${n}@example.com`),
			},
		});

		const user = userFactory();

		expect(user.email).toBe('datx1@example.com');
	});
});
