import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UrlObject } from 'url';

import { useSession } from '@/hooks/use-session';
import { Session } from '@/models/Session';

interface IAuthRedirectProps {
	/**
	 * `href` param passed to Next.js `Router.push` method
	 */
	to: UrlObject | string;
	/**
	 * If this is set to `true` user will be redirected if he is logged in.
	 * Useful when you don't want to show login page to already logged in users.
	 */
	ifFound?: boolean;
	/**
	 * Callback that will trigger a redirect if true is returned.
	 * Useful when you need to redirect base on some attribute, e.g. if user is not admin
	 */
	condition?(session: Session): boolean;
}

export const AuthRedirect: FC<IAuthRedirectProps> = ({ to, ifFound, condition }) => {
	const { data, isValidating, error } = useSession();
	const router = useRouter();

	useEffect(() => {
		// if state is validating, wait until request is done
		if (isValidating) {
			return;
		}

		// https://swr.vercel.app/advanced/performance#dependency-collection
		const hydration = data === undefined && error === undefined && isValidating === false;

		// if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
		if (hydration) {
			return;
		}

		// `condition` has a priority over a `ifFound` property
		const shouldRedirect = condition ? condition(data.data) : (ifFound && data) || (!ifFound && !data);

		if (shouldRedirect) {
			router.push(to);
		}
	}, [data, ifFound, to, error, isValidating, router, condition]);

	// this component renders nothing since it is only used to redirect if needed
	return null;
};
