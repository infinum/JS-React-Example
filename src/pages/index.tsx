import React from 'react';
import { NextPage } from 'next';

import { MainLayout } from '@/components/shared/layouts/MainLayout/MainLayout';
import { TodoListSection } from '@/components/home/TodoListSection/TodoListSection';

const Home: NextPage = () => {
	return (
		<MainLayout>
			<TodoListSection />
		</MainLayout>
	);
};

export default Home;
