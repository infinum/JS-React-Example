import React, { Suspense } from 'react';
import { NextPage } from 'next';

import { Layout } from '@/components/shared/layouts/Layout/Layout';
import { TodoLists } from '@/components/features/todo-lists/TodoLists';

const Home: NextPage = () => {
	return (
		<Layout>
			<Suspense>
				<TodoLists />
			</Suspense>
		</Layout>
	);
};

export default Home;
