import { buildJsonApiDocument } from '@/datx/buildJsonApiDocument';
import { buildMany } from '@datx/test-data-factory';
import { sessionFactory, userFactory } from '__mocks__/factories';

describe('buildJsonApiDocument', () => {
	it('should work with single resources', () => {
		const user = userFactory();

		expect(buildJsonApiDocument(user)).toEqual({
			data: {
				id: String(user.id),
				type: 'users',
				attributes: {
					firstName: user.firstName,
					lastName: user.lastName,
				},
			},
		});
	});

	it('should work with collections', () => {
		const users = buildMany(userFactory, 3);

		expect(buildJsonApiDocument(users)).toEqual({
			data: users.map((user) => ({
				id: String(user.id),
				type: 'users',
				attributes: {
					firstName: user.firstName,
					lastName: user.lastName,
				},
			})),
		});
	});

	it('should work with toOne relationships', () => {
		const session = sessionFactory();

		expect(buildJsonApiDocument(session)).toEqual({
			data: {
				id: String(session.id),
				type: 'sessions',
				attributes: { email: session.email },
				relationships: {
					user: {
						data: { id: String(session.user.id), type: 'users' },
					},
				},
			},
			included: [
				{
					id: String(session.user.id),
					type: 'users',
					attributes: {
						firstName: session.user.firstName,
						lastName: session.user.lastName,
					},
				},
			],
		});
	});

	it('should work with toMany relationships', () => {
		// TODO
		expect(true).toBe(true);
	});

	it('should deduplicate included resources', () => {
		const user = userFactory();
		const session1 = sessionFactory({ overrides: { user } });
		const session2 = sessionFactory({ overrides: { user } });

		expect(buildJsonApiDocument([session1, session2])).toEqual({
			data: [
				{
					id: String(session1.id),
					type: 'sessions',
					attributes: { email: session1.email },
					relationships: {
						user: {
							data: { id: String(user.id), type: 'users' },
						},
					},
				},
				{
					id: String(session2.id),
					type: 'sessions',
					attributes: { email: session2.email },
					relationships: {
						user: {
							data: { id: String(user.id), type: 'users' },
						},
					},
				},
			],
			included: [
				{
					id: String(user.id),
					type: 'users',
					attributes: {
						firstName: user.firstName,
						lastName: user.lastName,
					},
				},
			],
		});
	});
});
