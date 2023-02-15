import { createTestClient } from './create-test-client';
import { createFactory, Attributes, sequence } from '../src';
import { Post } from './models/Post';
import { User } from './models/User';

const client = createTestClient();
const factory = createFactory(client);

describe('General', () => {
	beforeEach(() => {
		client.reset();
	});

	it('should build a basic object from a factory', () => {
		const postFactory = factory(Post, {
			fields: {
				body: 'Hello world',
			},
		});

		const post = postFactory();

		console.log(post);

		expect(post).toBeInstanceOf(Post);
		expect(post.body).toBe('Hello world');
	});

	describe('Sequences', () => {
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
});
