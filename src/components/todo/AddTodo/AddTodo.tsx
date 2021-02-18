import React, { FC } from 'react';
import { Button, HStack, Input, useToast } from '@chakra-ui/react';
import { useState } from 'react';
// import { nanoid } from 'nanoid';
import { mutate } from 'swr';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IAddTodoProps {}

export const AddTodo: FC<IAddTodoProps> = () => {
	const toast = useToast();
	const [content, setContent] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!content) {
			toast({
				title: 'No content',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
			return;
		}

		// const todo = {
		// 	id: nanoid(),
		// 	body: content,
		// };

		mutate('/jsonapi/todos');
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
