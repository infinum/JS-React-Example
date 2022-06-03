import React, { FC } from 'react';
import { Heading, Flex, Text } from '@chakra-ui/react';

import { ITodo } from '@/interfaces/ITodo';

interface IFlightCardProps {
	todo: ITodo;
}

export const Todo: FC<IFlightCardProps> = ({ todo, ...rest }) => (
	<Flex align="flex-start" direction="column" p={5} borderWidth="1px" shadow="md" {...rest}>
		<Heading as="h2" w="50%" mb={2} size="lg">
			{todo.title}
		</Heading>
		<Text>{todo.body}</Text>
	</Flex>
);
