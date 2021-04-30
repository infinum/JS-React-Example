import React, { FC } from 'react';
import { Box, Container, Divider, Heading, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useResourceList } from '@datx/jsonapi-react';

import { Todo } from '@/resources/Todo';
import { TodoList } from '@/components/shared/todo/TodoList/TodoList';
import { LoadingMessage } from '@/components/shared/messages/LoadingMessage/LoadingMessage';
import { EmptyListMessage } from '@/components/shared/messages/EmptyListMessage/EmptyListMessage';

import PlusIcon from '@/assets/icons/ic-plus.svg';

export const TodoListSection: FC = () => {
	const { data, error } = useResourceList(() => [Todo]);

	if (error) {
		throw { statusCode: 404 };
	}

	if (!data) {
		return <LoadingMessage />;
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
				{data.length > 0 ? <TodoList todoList={data} /> : <EmptyListMessage />}
			</Box>
		</Container>
	);
};
