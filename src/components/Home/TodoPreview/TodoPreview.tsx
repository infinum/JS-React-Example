import React, { FC } from 'react';
import { Box, Divider, Heading, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';

import { Todo } from '@/models/Todo';
import { TodoList } from '../TodoList/TodoList';

import PlusIcon from '@/assets/icons/ic-plus.svg';

interface ITodoPreviewProps {
	todoList: Array<Todo>;
}

export const TodoPreview: FC<ITodoPreviewProps> = ({ todoList }) => (
	<Box as="section">
		<Heading as="h1" my={10}>
			Infinum todo list
			<NextLink href="/todo/new/edit" passHref>
				<IconButton ml={8} aria-label="Create new todo" icon={<Box width="16px" as={PlusIcon} />} />
			</NextLink>
		</Heading>

		<Divider />
		<TodoList todoList={todoList} />
	</Box>
);
