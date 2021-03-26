import React, { FC } from 'react';
import { Box, Container, Divider, Heading, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useResourceList } from '@datx/jsonapi-react';

import { Todo } from '@/models/Todo';
import { TodoList } from '../TodoList/TodoList';
import { Loading } from '@/components/shared/Loading/Loading';

import PlusIcon from '@/assets/icons/ic-plus.svg';

export const TodoListPreview: FC = () => {
	const { data, error } = useResourceList(() => [Todo]);

	if (error) {
		throw { statusCode: 404 };
	}

	if (!data) {
		return <Loading />;
	}

	return (
		<Container>
			<Box as="section">
				<Heading as="h1" my={10}>
					Infinum todo list
					<NextLink href="/todo/new/edit" passHref>
						<IconButton ml={8} aria-label="Create new todo" icon={<Box width="16px" as={PlusIcon} />} />
					</NextLink>
				</Heading>

				<Divider mb={10} />
				<TodoList todoList={data} />
			</Box>
		</Container>
	);
};
