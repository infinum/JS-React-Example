import styled from '@emotion/styled';
import Link from 'next/link';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from 'store';

const Content = styled.div``;

export function Home(): ReactElement {
	const store = useStore();
	const { t } = useTranslation();

	return (
		<Content>
			<h1>TODO Lists: {store.user.todoLists.length}</h1>
			<Link href="/new">
				<a>{t('addNew')}</a>
			</Link>
			{store.user.todoLists.length ? (
				<>
					{store.user.todoLists.map((list) => (
						<Link key={list.uuid} href={`/${list.uuid}`}>
							<a>{list.title}</a>
						</Link>
					))}
				</>
			) : (
				<div>{t('emptyLists')}</div>
			)}
		</Content>
	);
}
