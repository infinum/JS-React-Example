import React, { FC } from 'react';
import { Box, BoxProps, Button } from '@chakra-ui/react';

import { InputField } from '@/components/shared/fields/InputField/InputField';
import { useForm } from 'react-hook-form';
import { setApiErrors } from '@/utils/setApiErrors';
import { useSession } from '@/hooks/useSession';
import { Response } from '@datx/jsonapi';
import { useTranslation } from 'next-i18next';

type FormValues = {
	email: string;
	password: string;
};

export const LoginForm: FC<BoxProps> = () => {
	const { t } = useTranslation('login');
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<FormValues>();

	const { login } = useSession();

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
			<InputField
				label={t('form.email.label')}
				errors={errors}
				{...register('email', { required: t('form.required') })}
			/>
			<InputField
				label={t('form.password.label')}
				errors={errors}
				{...register('password', { required: t('form.required') })}
			/>
			<Button type="submit">{t('form.submit.label')}</Button>
		</Box>
	);
};
