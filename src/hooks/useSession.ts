import { useMemo } from 'react';
import { Response } from '@datx/jsonapi';
import { cache, SWRConfiguration } from 'swr';
import { useDatx, useResource } from '@/libs/@datx/jsonapi-react';

import { Session } from '@/resources/Session';
import { User } from '@/resources/User';
import { IError } from '@datx/jsonapi/dist/interfaces/JsonApi';

const createSession = (store, attributes) =>
	store.request('sessions', 'POST', attributes, { queryParams: { include: 'user' } });

interface IOptions extends SWRConfiguration<Response<Session>> {
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

export const useSession = ({ onLogoutSuccess, onLogoutError, ...rest }: IOptions = {}) => {
	const store = useDatx();

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
			login: (attributes) => mutate(() => createSession(store, attributes)),
			logout: async () => {
				try {
					mutate(undefined, false);
					await store.request('sessions', 'DELETE');
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
		// TODO!
		// find a way to remove onLoginSuccess, onLoginError, onLogoutError, onLogoutSuccess from
		// deps as they are new on each render!
		[store, mutate, onLogoutError, onLogoutSuccess]
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
