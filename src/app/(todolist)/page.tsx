import { TodoLists } from '@/app/(todolist)/_components/TodoLists/TodoLists';
import { Layout } from '@/app/_components/Layout/Layout';

export default function Home() {
	return (
		<Layout>
			<TodoLists />
		</Layout>
	);
}
