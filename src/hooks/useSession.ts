import { useEffect, useMemo, useRef } from 'react';
import { Response } from '@datx/jsonapi';
import { cache, SWRConfiguration } from 'swr';
import { useDatx, useResource } from '@/libs/@datx/jsonapi-react';
import { UrlObject } from 'url';
import { useRouter } from 'next/router';

import { Session } from '@/resources/Session';
import { User } from '@/resources/User';
import { IError } from '@datx/jsonapi/dist/interfaces/JsonApi';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

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

	const callbacksRef = useRef({
		onLoginSuccess,
		onLoginError,
		onLogoutError,
		onLogoutSuccess,
	});

	useIsomorphicLayoutEffect(() => {
		callbacksRef.current = {
			onLoginSuccess,
			onLoginError,
			onLogoutError,
			onLogoutSuccess,
		};
	});

	const handlers = useMemo(
		() => ({
			login: (attributes) => mutate(() => createSession(store, attributes)),
			logout: async () => {
				try {
					mutate(undefined, false);
					await store.request('sessions', 'DELETE');
					store.removeAll('sessions');
					cache.clear();
					mutate();
					if (callbacksRef.current.onLogoutSuccess) {
						callbacksRef.current.onLogoutSuccess();
					}
				} catch (logOutError) {
					if (callbacksRef.current.onLogoutError) {
						callbacksRef.current.onLogoutError(logOutError);
					}
				}
			},
		}),
		[store, mutate]
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
