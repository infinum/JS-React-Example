import React from 'react';
import { NextPage } from 'next';

import { MainLayout } from '@/components/shared/layouts/MainLayout/MainLayout';
import { TodoListSection } from '@/components/pages/home/TodoListSection/TodoListSection';

const Home: NextPage = () => {
	return (
		<MainLayout>
			<TodoListSection />
		</MainLayout>
	);
};

export default Home;
