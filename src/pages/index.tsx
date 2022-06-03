import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Container } from '@chakra-ui/react';

import { MainLayout } from '@/components/shared/layouts/MainLayout/MainLayout';
import { ITodo } from '@/interfaces/ITodo';
import { Todo } from '@/components/shared/todo/Todo';

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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(String(locale), ['common', 'mainNavigation'])),
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
