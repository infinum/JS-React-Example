import { NextPage } from 'next';

import { Layout } from '@/components/shared/layouts/Layout/Layout';
import { TodoLists } from '@/components/features/todo-lists/TodoLists';

const Home: NextPage = () => {
	return (
		<Layout>
			<TodoLists />
		</Layout>
	);
};

export default Home;
