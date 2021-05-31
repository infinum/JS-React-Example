import { useEffect, useMemo } from 'react';
import { Response } from '@datx/jsonapi';
import { cache, SWRConfiguration } from 'swr';
import { useDatx, useResource } from '@/libs/@datx/jsonapi-react';
import { UrlObject } from 'url';
import { useRouter } from 'next/router';

import { Session } from '@/resources/Session';
import { User } from '@/resources/User';
import { IError } from '@datx/jsonapi/dist/interfaces/JsonApi';

async function createSession(store, loginData) {
	const res = await store.request('sessions', 'POST', loginData, { queryParams: { include: 'user' } });

	return res.data as Session;
}

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
	/**
	 * on logout success callback
	 */
	onLogoutSuccess?: () => void;
	/**
	 * on logout error callback
	 */
	onLogoutError?: (error: Response<Session> | Error) => void;
	/**
	 * on login success callback
	 */
	onLoginSuccess?: (user: User) => void;
	/**
	 * on login error callback
	 */
	onLoginError?: (error: Array<IError> | Error) => void;
}

export const useSession = ({
	redirectTo,
	redirectIfFound,
	onLoginSuccess,
	onLoginError,
	onLogoutSuccess,
	onLogoutError,
	...rest
}: IOptions = {}) => {
	const store = useDatx();
	const router = useRouter();

	const { data: session, error, mutate, isValidating } = useResource<Session>(
		() => ['sessions', 'current', { queryParams: { include: 'user' } }],
		{
			shouldRetryOnError: false,
			...rest,
		}
	);

	const user = session?.user;

	const handlers = useMemo(
		() => ({
			login: async (loginData) => {
				try {
					const sessionResponse = await mutate(() => createSession(store, loginData), false);

					if (onLoginSuccess) {
						onLoginSuccess(sessionResponse?.user);
					}

					return sessionResponse;
				} catch (e) {
					if (e instanceof Response) {
						onLoginError(e.error);
					}

					throw e;
				}
			},
			logout: async () => {
				try {
					mutate(undefined, false);
					await store.request('sessions/current', 'DELETE');
					store.removeAll('sessions');
					cache.clear();
					mutate();
					if (onLogoutSuccess) {
						onLogoutSuccess();
					}
				} catch (logOutError) {
					if (onLogoutError) {
						onLogoutError(logOutError);
					}
				}
			},
		}),
		[store, mutate, onLoginSuccess, onLoginError]
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
		mutateSession: mutate,
		sessionError: error,
		isSessionValidating: isValidating,
		user,
		isSessionLoading: !session && !error,
		...handlers,
	};
};
