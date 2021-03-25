import React, { FC } from 'react';
import { Box, Text, StackDivider, StackProps, VStack, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

import { Todo } from '@/models/Todo';
import { EmptyListPlaceholder } from '../EmptyListPlaceholder/EmptyListPlaceholder';

interface ITodoListProps extends StackProps {
	todoList: Array<Todo>;
}

export const TodoList: FC<ITodoListProps> = ({ todoList, ...rest }) => {
	return (
		<VStack spacing={4} align="stretch" divider={<StackDivider borderColor="gray.200" />} {...rest}>
			{todoList.length ? (
				todoList.map((todo) => (
					<Box p={5} shadow="md" borderWidth="1px" key={todo.id}>
						<Text fontSize="xl">{todo.body}</Text>
						<NextLink href="/todo/[id]" as={`/todo/${todo.id}`} passHref>
							<Link color="red">Preview</Link>
						</NextLink>
					</Box>
				))
			) : (
				<EmptyListPlaceholder />
			)}
		</VStack>
	);
};
