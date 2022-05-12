import { useEffect, useMemo } from 'react';
import { Response } from '@datx/jsonapi';
import { cache, SWRConfiguration } from 'swr';
import { useDatx, useResource } from '@/libs/@datx/jsonapi-react';
import { UrlObject } from 'url';
import { useRouter } from 'next/router';

import { Session } from '@/resources/Session';

const createSession = (store, attributes) =>
	store.request('sessions', 'POST', attributes, { queryParams: { include: 'user' } });

interface IOptions extends SWRConfiguration<Response<Session>> {
	/**
	 * `href` param passed to Next.js `Router.push` method
	 */
	redirectTo?: UrlObject | string;
	/**
	 * If this is set to `true` user will be redirected if he is logged in.
	 * Useful when you don't want to show login page to already logged in users.
	 */
	redirectIfFound?: boolean;
}

export const useSession = ({ redirectTo, redirectIfFound, ...rest }: IOptions = {}) => {
	const store = useDatx();
	const router = useRouter();

	const {
		data: session,
		error,
		mutate,
		isValidating,
	} = useResource<Session>(() => [Session, 'current', { queryParams: { include: 'user' } }], {
		shouldRetryOnError: false,
		...rest,
	});

	const user = session?.user;

	const handlers = useMemo(
		() => ({
			login: async (attributes) => mutate(createSession(store, attributes), false),
			logout: async () => {
				mutate(undefined, false);

				await store.request('sessions', 'DELETE');
				store.reset();
				cache.clear();

				return mutate();
			},
		}),
		[mutate, store]
	);

	useEffect(() => {
		// https://swr.vercel.app/advanced/performance#dependency-collection
		const hydration = session === undefined && error === undefined && isValidating === false;

		// if no redirect needed, just return (example: already on /dashboard)
		// if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
		if (!redirectTo || hydration || isValidating) return;

		if (
			// If redirectTo is set, redirect if the user was not found.
			(redirectTo && !redirectIfFound && !session) ||
			// If redirectIfFound is also set, redirect if the user was found
			(redirectIfFound && session)
		) {
			router.push(redirectTo);
		}
	}, [session, redirectIfFound, redirectTo, error, isValidating, router]);

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
