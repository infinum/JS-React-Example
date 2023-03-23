import { isJsonApiClass, isModelPersisted, modelToJsonApi } from '@datx/jsonapi';
import { buildMany } from '@datx/test-data-factory';
import { rest } from 'msw';
import { sessionFactory } from '../__factories__/session';
import { userFactory } from '../__factories__/user';
import { flightFactory } from '../__factories__/flight';
import { Session } from '@/models/Session';
import { User } from '@/models/User';

export const handlers = [
	// datx.get({
	// 	op: 'getMany',
	// 	type: Flight.type,
	// } as const, (req, res, ctx) => {

	// }),
	rest.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/sessions/current`, (req, res, ctx) => {
		userFactory.reset();
		sessionFactory.reset();
		const include = req.url.searchParams.get('include');
		const session = sessionFactory();

		const included = include
			?.split(',')
			.map((include) => {
				const includeData = session[include];

				if (Array.isArray(includeData)) {
					return includeData.map((item) => modelToJsonApi(item));
				}

				const rawModel = modelToJsonApi(includeData);

				rawModel.id = includeData.id;

				return rawModel;
			})
			.flat();

		const rawSessionModel = modelToJsonApi(session);
		rawSessionModel.id = session.id;

		return res(
			ctx.json({
				data: rawSessionModel,
				included,
			})
		);
	}),
	rest.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/flights`, (_req, res, ctx) => {
		flightFactory.reset();
		const data = buildMany(flightFactory, 2);

		return res(
			ctx.json({
				data: data.map((flight) => modelToJsonApi(flight)),
			})
		);
	}),
];
