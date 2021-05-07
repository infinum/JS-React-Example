import React, { FC } from 'react';
import { StackProps, VStack } from '@chakra-ui/react';

import { Todo } from '@/resources/Todo';
import { TodoCard } from '@/components/shared/todo/TodoCard/TodoCard';

interface ITodoListProps extends StackProps {
	todoList: Array<Todo>;
}

export const TodoList: FC<ITodoListProps> = ({ todoList, ...rest }) => {
	return (
		<VStack spacing={4} align="stretch" {...rest}>
			{todoList.map((todo) => (
				<TodoCard key={todo.id} todo={todo} />
			))}
		</VStack>
	);
};
