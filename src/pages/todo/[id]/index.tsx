import React from 'react';
import { NextPage } from 'next';

import { MainLayout } from '@/components/shared/layouts/MainLayout/MainLayout';
import { TodoShowSection } from '@/components/pages/todo/TodoShowSection/TodoShowSection';

const SingleTodo: NextPage = () => {
	return (
		<MainLayout>
			<TodoShowSection />
		</MainLayout>
	);
};

export default SingleTodo;
