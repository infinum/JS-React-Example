import React, { FC } from 'react';
import { Button, HStack, Input, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation } from '@datx/jsonapi-react';
import { TodoResource } from '../../../resources/TodoResource';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAddTodoProps {}

export const AddTodo: FC<IAddTodoProps> = () => {
	const toast = useToast();
	const [content, setContent] = useState('');

	const { create } = useMutation(TodoResource);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!content) {
			toast({
				title: 'No content',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
			return;
		}

		await create({ body: content });

		// mutate('/jsonapi/todos');
		setContent('');
	};

	return (
		<form onSubmit={handleSubmit}>
			<HStack mb="8">
				<Input
					variant="filled"
					placeholder="learning chakraui with todo app"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
				<Button colorScheme="pink" px="8" type="submit">
					Add Todo
				</Button>
			</HStack>
		</form>
	);
};
