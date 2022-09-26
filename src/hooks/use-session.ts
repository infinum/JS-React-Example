import { useDatx } from '@datx/swr';

import { Session } from '@/models/Session';

export const sessionExpression = {
	op: 'getOne',
	type: Session.type,
	id: 'current',
	queryParams: { include: 'user' },
} as const;

export const useSession = (config?: any) =>
	useDatx(sessionExpression, {
		shouldRetryOnError: false,
		...(config || {}),
	});
