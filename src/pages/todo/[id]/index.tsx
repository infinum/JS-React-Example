import React from 'react';
import { NextPage } from 'next';

import { Navigation } from '@/components/shared/Navigation/Navigation';
import { Meta } from '@/components/utilities/Meta/Meta';
import { TodoSinglePreview } from '@/components/Todo/TodoSinglePreview';

const SingleTodo: NextPage = () => {
	return (
		<>
			<Meta />
			<Navigation />
			<TodoSinglePreview />
		</>
	);
};

export default SingleTodo;
