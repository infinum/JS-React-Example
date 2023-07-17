import { buildJsonApiDocument } from '@/datx/buildJsonApiDocument';
import { TEST_INVALID_EMAIL, TEST_INVALID_PASSWORD } from '__mocks__/constants';
import { sessionFactory } from '__mocks__/factories';
import { rest } from 'msw';

export const generateTestApiUrl = (path: string) => {
	return process.env.API_TEST_ENDPOINT + path;
};

export const MOCKED_URLS = {
	SessionCurrent: generateTestApiUrl('sessions/current'),
	SessionMe: generateTestApiUrl('sessions/me'),
	Session: generateTestApiUrl('sessions'),
	Flights: generateTestApiUrl('flights'),
} as const;

export const handlers = [
	rest.get(MOCKED_URLS.SessionCurrent, async (_req, res, ctx) => {
		return res(
			ctx.status(401),
			ctx.json({
				errors: [
					{
						status: 'unauthorized',
						code: 'UNAUTHORIZED',
						title: 'Unauthorized',
						detail: 'Must be logged in to perform this action',
					},
				],
			})
		);
	}),
	rest.post(MOCKED_URLS.Session, async (req, res, ctx) => {
		const body = await req.json();
		const emailOverride = body.data?.attributes?.email || undefined;

		return res(
			ctx.status(200),
			ctx.json(
				sessionFactory({
					overrides: {
						email: emailOverride,
					},
				})
			)
		);
	}),
	rest.delete(MOCKED_URLS.SessionMe, async (_req, res, ctx) => {
		return res(ctx.status(204));
	}),
];

export const handlerOverrides = {
	invalidEmailLogin: rest.post(MOCKED_URLS.Session, (_req, res, ctx) => {
		return res(
			ctx.status(422),
			ctx.json({
				errors: [
					{
						status: 'unprocessable entity',
						code: 'UNPROCESSABLE_ENTITY',
						title: 'Unprocessable Entity',
						detail: TEST_INVALID_EMAIL,
						source: { parameter: 'email', pointer: 'data/attributes/email' },
					},
				],
			})
		);
	}),
	invalidPasswordLogin: rest.post(MOCKED_URLS.Session, (_req, res, ctx) => {
		return res(
			ctx.status(422),
			ctx.json({
				errors: [
					{
						status: 'unprocessable entity',
						code: 'UNPROCESSABLE_ENTITY',
						title: 'Unprocessable Entity',
						detail: TEST_INVALID_PASSWORD,
						source: { parameter: 'password', pointer: 'data/attributes/password' },
					},
				],
			})
		);
	}),
	activeCurrentSession: rest.get(MOCKED_URLS.SessionCurrent, async (req, res, ctx) => {
		const session = sessionFactory();

		return res(ctx.status(200), ctx.json(buildJsonApiDocument(session)));
	}),
};
