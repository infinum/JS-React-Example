import { createTestClient } from './create-test-client';
import { createFactory, buildMany } from '../src';
import { User } from './models/User';

const client = createTestClient();
const factory = createFactory(client);

describe('buildMany', () => {
	beforeEach(() => {
		client.reset();
	});

	it('should build multiple objects', () => {
		const userFactory = factory(User, {
			fields: {
				name: 'John Doe',
			},
		});

		const users = buildMany(userFactory, 3);

		expect(users).toHaveLength(3);
		expect(users[0].name).toBe('John Doe');
		expect(users[1].name).toBe('John Doe');
		expect(users[2].name).toBe('John Doe');
	});
});
