import React, { FC } from 'react';
import { Box, BoxProps, Button } from '@chakra-ui/react';

import { InputField } from '@/components/shared/fields/InputField/InputField';
import { useForm } from 'react-hook-form';
import { setApiErrors } from '@/utils/setApiErrors';
import { useSession } from '@/hooks/useSession';
import { Response } from '@datx/jsonapi';

type FormValues = {
	email: string;
	password: string;
};

export const LoginForm: FC<BoxProps> = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<FormValues>();

	const { error, login } = useSession({ redirectIfFound: true, redirectTo: '/' });

	console.log(error);

	async function onSubmit(formData: FormValues) {
		try {
			const data = {
				type: 'session',
				id: '',
				attributes: {
					...formData,
				},
			};

			await login({ data });
		} catch (errors) {
			if (errors instanceof Response) {
				setApiErrors(errors.error).forEach(({ name, type, message }) => setError(name, { type, message }));
			}
		}
	}

	return (
		<Box as="form" onSubmit={handleSubmit(onSubmit)}>
			<InputField label="Emal" errors={errors} {...register('email', { required: 'This field is required' })} />
			<InputField label="Password" errors={errors} {...register('password', { required: 'This field is required' })} />
			<Button type="submit">Login</Button>
		</Box>
	);
};
