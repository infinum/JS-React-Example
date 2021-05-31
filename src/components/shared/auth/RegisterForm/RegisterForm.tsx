import React, { FC } from 'react';
import { Box, BoxProps, Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useDatx } from '@/libs/@datx/jsonapi-react';

import { InputField } from '@/components/shared/fields/InputField/InputField';
import { CheckboxField } from '@/components/shared/fields/CheckboxField/CheckboxField';
import { setApiErrors } from '@/utils/setApiErrors';

type FormValues = {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	termsAccepted: boolean;
};

export const RegisterForm: FC<BoxProps> = () => {
	const client = useDatx();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<FormValues>();

	async function onSubmit(formData: FormValues) {
		try {
			const data = {
				type: 'registration',
				id: '',
				attributes: {
					...formData,
				},
			};

			await client.request('registrations', 'POST', { data });

			await router.push('/login');
		} catch (errors) {
			if (errors?.error instanceof Array) {
				setApiErrors(errors.error).forEach(({ name, type, message }) => setError(name, { type, message }));
			}
		}
	}

	return (
		<Box as="form" onSubmit={handleSubmit(onSubmit)}>
			<InputField label="Emal" errors={errors} {...register('email', { required: 'This field is required' })} />
			<InputField
				label="First name"
				errors={errors}
				{...register('firstName', { required: 'This field is required' })}
			/>
			<InputField label="Last name" errors={errors} {...register('lastName', { required: 'This field is required' })} />
			<InputField
				label="Password"
				type="password"
				errors={errors}
				{...register('password', { required: 'This field is required' })}
			/>
			<CheckboxField
				label="Terms and conditions"
				errors={errors}
				{...register('termsAccepted', { required: 'This field is required' })}
			/>
			<Button type="submit">Login</Button>
		</Box>
	);
};
