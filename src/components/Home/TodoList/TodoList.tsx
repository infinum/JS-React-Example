import React, { FC } from 'react';
import { Box, Text, StackDivider, StackProps, VStack, Button, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';

import { Todo } from '@/models/Todo';
import { EmptyListPlaceholder } from '../EmptyListPlaceholder/EmptyListPlaceholder';

import EditIcon from '@/assets/icons/ic-edit.svg';

interface ITodoListProps extends StackProps {
	todoList: Array<Todo>;
}

export const TodoList: FC<ITodoListProps> = ({ todoList, ...rest }) => {
	return (
		<VStack spacing={4} align="stretch" divider={<StackDivider borderColor="gray.200" />} {...rest}>
			{todoList.length ? (
				todoList.map((todo) => (
					<Box p={5} shadow="md" borderWidth="1px" key={todo.id}>
						<Text fontSize="xl" mb={8}>
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
				))
			) : (
				<EmptyListPlaceholder />
			)}
		</VStack>
	);
};
