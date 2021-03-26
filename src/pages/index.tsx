import React from 'react';
import { NextPage } from 'next';

import { Meta } from '@/components/utilities/Meta/Meta';
import { Navigation } from '@/components/shared/Navigation/Navigation';
import { TodoListPreview } from '@/components/Home/TodoListPreview/TodoListPreview';

const Home: NextPage = () => {
	return (
		<>
			<Meta />
			<Navigation />
			<TodoListPreview />
		</>
	);
};

export default Home;
