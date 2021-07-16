import React from 'react';
import { GetServerSideProps, NextPage } from 'next';

import { MainLayout } from '@/components/shared/layouts/MainLayout/MainLayout';
import { ITodo } from '@/interfaces/ITodo';
import { Todo } from '@/components/shared/todo/Todo';
import { Container } from '@chakra-ui/react';

interface IHomeProps {
	todos: Array<ITodo>;
}

const Home: NextPage<IHomeProps> = ({ todos }) => {
	return (
		<MainLayout>
			<Container py={5}>
				{todos.map((todo) => (
					<Todo key={todo.id} todo={todo} />
				))}
			</Container>
		</MainLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async () => {
	return {
		props: {
			todos: [
				{
					id: 1,
					title: 'Task #1',
					body: 'Implement Datx methods for getServerSideProps!',
				},
			],
		},
	};
};

export default Home;
