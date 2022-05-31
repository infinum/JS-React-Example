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
				// This code works type definition of cache is not up to date - currently PR for fixing this is open https://github.com/vercel/swr/pull/1936
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				cache.clear();

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
