import React, { FC } from 'react';
import { HStack, VStack, Text, IconButton, StackDivider, Spacer, Badge } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { TodoResource } from '@/resources/TodoResource';
import { useResources } from '../../../libs/@datx/jsonapi-react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ITodoListProps {}

export const TodoList: FC<ITodoListProps> = () => {
	const { data: todos } = useResources([TodoResource]);

	if (!todos || todos.length === 0) {
		return (
			<Badge colorScheme="green" p="4" m="4" borderRadius="lg">
				No Todos, yay!!!
			</Badge>
		);
	}

	return (
		<VStack
			divider={<StackDivider />}
			borderColor="gray.100"
			borderWidth="2px"
			p="4"
			borderRadius="lg"
			w="100%"
			maxW={{ base: '90vw', sm: '80vw', lg: '50vw', xl: '40vw' }}
			alignItems="stretch"
		>
			{todos.map((todo) => (
				<HStack key={todo.id}>
					<Text>{todo.body}</Text>
					<Spacer />
					<IconButton aria-label="delete todo" icon={<FaTrash />} isRound onClick={() => console.log(todo.id)} />
				</HStack>
			))}
		</VStack>
	);
};
