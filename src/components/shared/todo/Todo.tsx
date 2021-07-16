import React, { FC } from 'react';
import { Heading, Flex, Text } from '@chakra-ui/react';

import { ITodo } from '@/interfaces/ITodo';

interface IFlightCardProps {
	todo: ITodo;
}

export const Todo: FC<IFlightCardProps> = ({ todo, ...rest }) => (
	<Flex p={5} shadow="md" borderWidth="1px" align="flex-start" direction="column" {...rest}>
		<Heading as="h2" size="lg" mb={2} w="50%">
			{todo.title}
		</Heading>
		<Text>{todo.body}</Text>
	</Flex>
);
