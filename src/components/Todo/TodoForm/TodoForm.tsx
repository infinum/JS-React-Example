import React, { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { InputField } from '@/components/shared/InputField/InputField';
import { ITodoFormValues } from '@/interfaces/ITodoFormValues';
import { Todo } from '@/models/Todo';

interface ITodoFormProps {
	todo?: Todo;
	onFormSubmit(values: ITodoFormValues): Promise<void>;
}

export const TodoForm: FC<ITodoFormProps> = ({ todo, onFormSubmit }) => {
	const { register, handleSubmit, errors } = useForm<ITodoFormValues>({ defaultValues: todo });

	async function onSubmit(values) {
		console.log(values);
		try {
			await onFormSubmit(values);
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<InputField
				name="title"
				label="Enter todo title"
				errors={errors}
				ref={register({ required: 'This field is required' })}
			/>
			<InputField
				name="body"
				label="Enter todo body"
				errors={errors}
				ref={register({ required: 'This field is required' })}
			/>
			<Button type="submit">Submit</Button>
		</form>
	);
};
