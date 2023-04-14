import { Flight } from '@/models/Flight';
import { User } from '@/models/User';
import { IGetManyExpression } from '@datx/swr';

export const getFlightsQuery = (user: User | undefined, page: string | undefined) =>
	user && page
		? ({
				op: 'getMany',
				type: Flight.type,
				queryParams: {
					custom: [...(page ? [{ key: 'page[number]', value: page }] : [])],
				},
		  } as const satisfies IGetManyExpression<typeof Flight>)
		: null;
