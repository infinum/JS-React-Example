import { createTestClient } from './create-test-client';
import { buildMany, createFactory, perBuild, sequence } from '../src';
import { User } from './models/User';
import { Post } from './models/Post';
import { Comment } from './models/Comment';

const client = createTestClient();
const factory = createFactory(client);

describe('relationships', () => {
	beforeEach(() => {
		client.reset();
	});

	it('should create relationships', () => {
		const userFactory = factory(User, {
			fields: {
				id: sequence(),
				name: sequence((n) => `John Doe ${n}`),
				email: sequence((n) => `john${n}@example.com`),
				createdAt: new Date('2020-01-01'),
			},
		});

		const commentFactory = factory(Comment, {
			fields: {
				id: sequence(),
				body: 'Hello world',
				author: perBuild(() => userFactory()),
			},
		});

		const postFactory = factory(Post, {
			fields: {
				id: sequence(),
				title: 'My first post',
				body: 'Hello world',
				comments: buildMany(commentFactory, 5),
			},
		});

		const post = postFactory();

		expect(post.comments.length).toBe(5);
		expect(post.comments[0].author.name).toBe('John Doe 1');
	});
});
