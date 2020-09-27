import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';

import { useStore } from 'store';
import { User } from '../models/User';
import { getCurrentUser } from '../utils/fetchers';

// TODO: Should this be here?
// TODO: Invalidation?
export const withAuth = (Component: React.FC): React.FC => {
	const WithAuth = (props: object): ReactElement => {
		const [isLoggedIn, setIsLoggedIn] = useState(false);
		const store = useStore();
		const router = useRouter();

		useEffect(() => {
			getCurrentUser.fetch().then(
				() => {
					const hasUser = Boolean(store.user);
					setIsLoggedIn(hasUser);
					if (!hasUser) {
						router.replace('/login');
					}
				},
				(e) => {
					if (e.status === 401) {
						store.removeAll(User);
						router.replace('/login');
					}
				}
			);
		}, [router, getCurrentUser]);

		if (isLoggedIn) {
			return <Component {...props} />;
		}

		return null;
	};

	return WithAuth;
};
