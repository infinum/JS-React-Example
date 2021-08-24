import { useMemo } from 'react';
import { Response } from '@datx/jsonapi';
import { cache, SWRConfiguration } from 'swr';
import { useDatx, useResource } from '@/libs/@datx/jsonapi-react';
import { useCallbackRef } from '@chakra-ui/hooks';

import { Session } from '@/resources/Session';
import { User } from '@/resources/User';
import { IError } from '@datx/jsonapi/dist/interfaces/JsonApi';

const createSession = (store, attributes) =>
	store.request('sessions', 'POST', attributes, { queryParams: { include: 'user' } });

interface IOptions extends SWRConfiguration<Response<Session>> {
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
	onLogoutSuccess,
	onLogoutError,
	onLoginSuccess,
	onLoginError,
	...rest
}: IOptions = {}) => {
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

	const onLoginSuccessRef = useCallbackRef(onLoginSuccess);
	const onLoginErrorRef = useCallbackRef(onLoginError);
	const onLogoutErrorRef = useCallbackRef(onLogoutError);
	const onLogoutSuccessRef = useCallbackRef(onLogoutSuccess);

	const handlers = useMemo(
		() => ({
			login: async (attributes) => {
				let session = null;

				try {
					session = await createSession(store, attributes);
				} catch (error) {
					onLoginErrorRef?.(error);

					return Promise.reject(error);
				}

				onLoginSuccessRef?.(session);

				return mutate(session, false);
			},
			logout: async () => {
				mutate(undefined, false);

				try {
					await store.request('sessions', 'DELETE');
					store.reset();
					cache.clear();
					await mutate();
				} catch (error) {
					onLogoutErrorRef?.(error);

					return Promise.reject(error);
				}

				onLogoutSuccessRef?.();
			},
		}),
		[mutate, onLoginErrorRef, onLoginSuccessRef, onLogoutErrorRef, onLogoutSuccessRef, store]
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
