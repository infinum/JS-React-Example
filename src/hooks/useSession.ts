import { useMemo } from 'react';
import { Response } from '@datx/jsonapi';
import { useSWRConfig, SWRConfiguration } from 'swr';
import { useDatx, useResource } from '@/libs/@datx/jsonapi-react';

import { Session } from '@/resources/Session';

const createSession = (store, attributes) =>
	store.request('sessions', 'POST', attributes, { queryParams: { include: 'user' } });

export const useSession = (props: SWRConfiguration<Response<Session>> = {}) => {
	const store = useDatx();
	const { cache } = useSWRConfig();

	const {
		data: session,
		error,
		mutate,
		isValidating,
	} = useResource<Session>(() => [Session, 'current', { queryParams: { include: 'user' } }], {
		shouldRetryOnError: false,
		...props,
	});

	const user = session?.user;

	const handlers = useMemo(
		() => ({
			login: async (attributes) => mutate(createSession(store, attributes), false),
			logout: async () => {
				mutate(undefined, false);

				await store.request('sessions', 'DELETE');
				store.reset();
				cache.clear(); //TODO ??

				return mutate();
			},
		}),
		[mutate, store, cache]
	);

	return {
		session,
		mutate,
		error,
		isValidating,
		user,
		isLoading: !session && !error,
		...handlers,
	};
};
