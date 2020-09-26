import styled from '@emotion/styled';
import Head from 'next/head';
import { ReactElement } from 'react';

import { User } from 'models/User';
import { useStore } from 'store';

const Content = styled.h1``;

export default function Home(): ReactElement {
	const store = useStore();

	if (store.findAll(User).length) {
		return <h1>Logged in!</h1>;
	}

	return (
		<>
			<Head>
				<title>Todos</title>
			</Head>
			<Content>Hello world!</Content>
		</>
	);
}
