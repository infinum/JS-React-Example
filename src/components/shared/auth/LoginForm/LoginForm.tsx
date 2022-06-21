import React, { FC } from 'react';
import { Box, BoxProps, Button } from '@chakra-ui/react';
import { InputField } from '@/components/shared/fields/InputField/InputField';
import { useForm } from 'react-hook-form';
import { setApiErrors } from '@/utils/setApiErrors';
import { Response } from '@datx/jsonapi';
import { useTranslation } from 'next-i18next';
import { login } from '@/mutations/auth';
import { useClient } from '@datx/swr';
import { useSession } from '@/hooks/use-session';

interface IFormValues {
	email: string;
	password: string;
}

export const LoginForm: FC<BoxProps> = () => {
	const { t } = useTranslation('login');
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<IFormValues>();
	const { mutate } = useSession();
	const client = useClient();

	async function onSubmit(formData: IFormValues) {
		try {
			const data = {
				data: {
					type: 'session',
					id: '',
					attributes: {
						...formData,
					},
				},
			};

			await mutate(() => login(client, data), false);
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
