import { createTestClient } from './create-test-client';
import { createFactory } from '../src';
import { Post } from './models/Post';
import { User } from './models/User';

const client = createTestClient();
const factory = createFactory(client);

describe('general', () => {
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

		expect(post).toBeInstanceOf(Post);
		expect(post.body).toBe('Hello world');
	});

	it('should generates the same object each time', () => {
		const userFactory = factory(User, {
			fields: {
				avatar: {
					url: 'https://example.com/avatar.png',
				},
			},
		});

		const user1 = userFactory();
		const user2 = userFactory();

		expect(user1.avatar).toBe(user2.avatar);
	});
});
