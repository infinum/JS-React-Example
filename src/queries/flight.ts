import { Flight } from '@/models/Flight';
import { User } from '@/models/User';

export const flightsQuery = (user?: User) => () =>
	user
		? ({
				op: 'getMany',
				type: Flight.type,
		  } as const)
		: null;
