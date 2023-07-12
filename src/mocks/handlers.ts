import { sessionFactory } from '__mocks__/factories';
import { rest } from 'msw';

export const generateApiUrl = (path: string) => {
	return process.env.NEXT_PUBLIC_API_ENDPOINT + path;
};

export const MOCKED_URLS = {
	SessionCurrent: generateApiUrl('sessions/current'),
	Session: generateApiUrl('sessions'),
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
];

export const handlerOverrides = {
	invalidLogin: rest.post(MOCKED_URLS.Session, (_req, res, ctx) => {
		return res(
			ctx.status(422),
			ctx.json({
				errors: [
					{
						status: 'unprocessable entity',
						code: 'UNPROCESSABLE_ENTITY',
						title: 'Unprocessable Entity',
						detail: 'Email User not found',
						source: { parameter: 'email', pointer: 'data/attributes/email' },
					},
				],
			})
		);
	}),
	activeCurrentSession: rest.get(MOCKED_URLS.SessionCurrent, async (_req, res, ctx) => {
		return res(ctx.status(200), ctx.json(sessionFactory()));
	}),
};
