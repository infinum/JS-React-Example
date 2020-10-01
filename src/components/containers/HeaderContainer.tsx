import Link from 'next/link';
import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { User } from 'models/User';
import { useStore } from 'store';
import { logout } from 'utils/fetchers';
import { LanguagePicker } from '../ui/LanguagePicker';

export const HeaderContainer = observer(
	(): ReactElement => {
		const store = useStore();
		const router = useRouter();
		const { t } = useTranslation();

		const isLoggedIn = Boolean(store.user);

		const onLogout = async (): Promise<void> => {
			await logout.fetch();
			store.removeAll(User);
			router.push('/');
		};

		return (
			<header>
				<Link href="/">
					<a>{t('home')}</a>
				</Link>
				{isLoggedIn ? (
					<button onClick={onLogout}>{t('logout')}</button>
				) : (
					<Link href="/login">
						<a>{t('logIn')}</a>
					</Link>
				)}
				<LanguagePicker/>
			</header>
		);
	}
);
