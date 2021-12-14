import React from 'react';
import { NextPage } from 'next';
import { Todos } from '@/components/features/todos/Todos';
import { Layout } from '@/components/shared/layouts/Layout/Layout';

const Home: NextPage = () => {
	return (
		<Layout>
			<Todos />
		</Layout>
	);
};

export default Home;
