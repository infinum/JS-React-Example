import Link from 'next/link';
import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';

import { User } from 'models/User';
import { useStore } from 'store';
import { logout } from 'utils/fetchers';

export const HeaderContainer = observer(
	(): ReactElement => {
		const store = useStore();
		const router = useRouter();

		const isLoggedIn = Boolean(store.user);

		const onLogout = async (): Promise<void> => {
			await logout.fetch();
			store.removeAll(User);
			router.push('/');
		};

		return (
			<header>
				<Link href="/">
					<a>Home</a>
				</Link>
				{isLoggedIn ? (
					<button onClick={onLogout}>Logout</button>
				) : (
					<Link href="/login">
						<a>Log in</a>
					</Link>
				)}
			</header>
		);
	}
);
