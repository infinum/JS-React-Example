import React, { FC } from 'react';
import { Box, BoxProps, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { InputField } from '@/components/shared/fields/InputField/InputField';
import { useForm } from 'react-hook-form';
import { setApiErrors } from '@/helpers/setApiErrors';
import { useSession } from '@/hooks/useSession';

export const LoginForm: FC<BoxProps> = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<any>();
	const router = useRouter();

	async function onLoginSuccess() {
		await router.push('/');
	}

	async function onLoginError(loginErrors: Array<any>) {
		setApiErrors(loginErrors).forEach(({ name, type, message }) => setError(name, { type, message }));
	}

	async function onSubmit(formData) {
		try {
			const data = {
				type: 'session',
				id: '',
				attributes: {
					...formData,
				},
			};

			login({ data });
		} catch (submitError) {
			setApiErrors(submitError.error).forEach(({ name, type, message }) => setError(name, { type, message }));
		}
	}

	const { login } = useSession({ onLoginSuccess, onLoginError });

	return (
		<Box as="form" onSubmit={handleSubmit(onSubmit)}>
			<InputField label="Emal" errors={errors} {...register('email', { required: 'This field is required' })} />
			<InputField label="Password" errors={errors} {...register('password', { required: 'This field is required' })} />
			<Button type="submit">Login</Button>
		</Box>
	);
};
