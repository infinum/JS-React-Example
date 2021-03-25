import React, { FC } from 'react';
import { Box, Divider, Heading } from '@chakra-ui/react';

import { Todo } from '@/models/Todo';
import { TodoList } from '../TodoList/TodoList';

interface ITodoPreviewProps {
	todoList: Array<Todo>;
}

export const TodoPreview: FC<ITodoPreviewProps> = ({ todoList }) => (
	<Box as="section">
		<Heading as="h1" my={10}>
			Infinum todo list
		</Heading>
		<Divider />
		<TodoList todoList={todoList} />
	</Box>
);
