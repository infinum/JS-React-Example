import React, { FC, useCallback } from 'react';
import { Container, Heading } from '@chakra-ui/react';
import { updateModel } from '@datx/core';
import { useResource } from '@datx/jsonapi-react';
import { useRouter } from 'next/dist/client/router';

import { TodoForm } from '../TodoForm/TodoForm';
import { Loading } from '@/components/shared/Loading/Loading';
import { Todo } from '@/models/Todo';
import { ITodoFormValues } from '@/interfaces/ITodoFormValues';

export const TodoEditPreview: FC = () => {
	const router = useRouter();
	const { data, error } = useResource(() => {
		if (router.query?.id === 'new') {
			throw null;
		}

		return [Todo, router.query?.id as string];
	});

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

	if (!data && router.query?.id !== 'new') {
		return <Loading />;
	}

	return (
		<Container>
			<Heading my={10}>Create new todo</Heading>
			<TodoForm todo={data} onFormSubmit={onSubmit} />
		</Container>
	);
};
