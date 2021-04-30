import React, { FC, useCallback } from 'react';
import { Container, Heading } from '@chakra-ui/react';
import { updateModel } from '@datx/core';
import { useResource } from '@datx/jsonapi-react';
import { useRouter } from 'next/dist/client/router';

import { TodoForm } from '@/components/shared/todo/TodoForm/TodoForm';
import { LoadingMessage } from '@/components/shared/messages/LoadingMessage/LoadingMessage';
import { Todo } from '@/resources/Todo';
import { ITodoFormValues } from '@/interfaces/ITodoFormValues';

export const TodoEditSection: FC = () => {
	const router = useRouter();
	const isNew = router.query.id === undefined || router.query.id === 'new';
	const { data, error } = useResource(() => (!isNew ? [Todo, router.query.id as string] : null));

	const onSubmit = useCallback(
		async (values: ITodoFormValues) => {
			if (router.query.id === 'new') {
				const newTodo = new Todo(values);

				const res = await newTodo.save();

				await router.replace('/todo/[id]/edit', `/todo/${(res as Todo).id}/edit`);
			} else {
				updateModel(data, { body: values.body, title: values.title });

				await data.save();

				await router.push('/');
			}
		},
		[router, data]
	);

	if (error) {
		throw { statusCode: 404 };
	}

	if (!isNew && !data) {
		return <LoadingMessage />;
	}

	return (
		<Container>
			<Heading my={10}>{isNew ? 'Create new' : 'Update'} todo</Heading>
			<TodoForm todo={data} onSubmit={onSubmit} />
		</Container>
	);
};
