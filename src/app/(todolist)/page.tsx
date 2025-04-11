import { TodoLists } from '@/app/(todolist)/_components/TodoLists/TodoLists';
import { Layout } from '@/app/_components/Layout/Layout';
import { NextPage } from 'next';

const Home: NextPage = () => {
	return (
		<Layout>
			<TodoLists />
		</Layout>
	);
};

export default Home;
