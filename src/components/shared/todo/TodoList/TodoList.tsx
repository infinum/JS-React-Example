import React, { FC } from 'react';
import { Box, Text, StackProps, VStack, Button, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';

import { Todo } from '@/resources/Todo';

import EditIcon from '@/assets/icons/ic-edit.svg';

interface ITodoListProps extends StackProps {
	todoList: Array<Todo>;
}

export const TodoList: FC<ITodoListProps> = ({ todoList, ...rest }) => {
	return (
		<VStack spacing={4} align="stretch" {...rest}>
			{todoList.map((todo) => (
				<Box p={5} shadow="md" borderWidth="1px" key={todo.id}>
					<Text fontSize="xl" mb={8} whiteSpace="pre-line">
						{todo.body}
					</Text>
					<NextLink href="/todo/[id]" as={`/todo/${todo.id}`} passHref>
						<Button mr={6} as="a">
							Preview
						</Button>
					</NextLink>
					<NextLink href="/todo/[id]/edit" as={`/todo/${todo.id}/edit`} passHref>
						<IconButton aria-label="Search database" icon={<EditIcon width="24px" />} />
					</NextLink>
				</Box>
			))}
		</VStack>
	);
};
