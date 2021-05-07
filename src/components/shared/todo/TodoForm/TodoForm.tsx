import React, { FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { InputField } from '@/components/shared/fields/InputField/InputField';
import { ITodoFormValues } from '@/interfaces/ITodoFormValues';
import { Todo } from '@/resources/Todo';
import { setApiErrors } from '@/helpers/setApiErrors';
import { TextareaField } from '@/components/shared/fields/TextareaField/TextareaField';

interface ITodoFormProps {
	todo?: Todo;
	onSubmit(values: ITodoFormValues): Promise<void>;
}

export const TodoForm: FC<ITodoFormProps> = ({ todo, onSubmit }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<ITodoFormValues>({ defaultValues: todo });

	async function onInternalSubmit(values) {
		try {
			await onSubmit(values);
		} catch (submitError) {
			setApiErrors(submitError.error).forEach(({ name, type, message }) => setError(name, { type, message }));
		}
	}

	return (
		<form onSubmit={handleSubmit(onInternalSubmit)}>
			<InputField
				label="Enter todo title"
				errors={errors}
				{...register('title', { required: 'This field is required' })}
			/>
			<TextareaField
				label="Enter todo body"
				errors={errors}
				{...register('body', { required: 'This field is required' })}
			/>
			<Button type="submit">Submit</Button>
		</form>
	);
};
