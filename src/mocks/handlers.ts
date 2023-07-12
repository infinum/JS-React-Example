import { sessionFactory } from '@/mocks/factories';
import { rest } from 'msw';

export const generateApiUrl = (path: string) => {
	return process.env.NEXT_PUBLIC_API_ENDPOINT + path;
};

export const handlers = [
	rest.get(generateApiUrl('sessions/current'), async (_req, res, ctx) => {
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
	rest.post(generateApiUrl('sessions'), async (req, res, ctx) => {
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
	invalidLogin: rest.post(generateApiUrl('sessions'), (_req, res, ctx) => {
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
	activeCurrentSession: rest.get(generateApiUrl('sessions/current'), async (_req, res, ctx) => {
		return res(ctx.status(200), ctx.json(sessionFactory()));
	}),
};
