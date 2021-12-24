import React from 'react';
import { NextPage } from 'next';
import { TodoLists } from '@/components/features/todo-lists/TodoLists';
import { Layout } from '@/components/shared/layouts/Layout/Layout';

const Home: NextPage = () => {
	return (
		<Layout>
			<TodoLists />
		</Layout>
	);
};

export default Home;
