import React from 'react';
import { NextPage } from 'next';

import { MainLayout } from '@/components/shared/layouts/MainLayout/MainLayout';
import { TodoEditSection } from '@/components/todo/TodoEditSection/TodoEditSection';

const TodoEdit: NextPage = () => {
	return (
		<MainLayout>
			<TodoEditSection />
		</MainLayout>
	);
};

export default TodoEdit;
