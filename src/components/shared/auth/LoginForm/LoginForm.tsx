import React, { FC } from 'react';
import { BoxProps, Button, Checkbox, HStack, Stack } from '@chakra-ui/react';
import { InputField } from '@/components/shared/fields/InputField/InputField';
import { useForm } from 'react-hook-form';
import { setApiErrors } from '@/utils/setApiErrors';
import { Response } from '@datx/jsonapi';
import { useTranslation } from 'next-i18next';
import { login } from '@/mutations/auth';
import { useClient } from '@datx/swr';
import { useSession } from '@/hooks/use-session';
import { PasswordField } from '@/components/shared/fields/PasswordField/PasswordField';

interface IFormValues {
	email: string;
	password: string;
}

export const LoginForm: FC<BoxProps> = () => {
	const { t } = useTranslation('loginForm');
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
		<Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing="6">
			<Stack spacing="5">
				<InputField
					label={t('email.label')}
					errors={errors}
					type="email"
					{...register('email', { required: t('required') })}
				/>
				<PasswordField
					label={t('password.label')}
					errors={errors}
					{...register('password', { required: t('required') })}
				/>
			</Stack>
			<HStack justify="space-between">
				<Checkbox colorScheme="red" defaultChecked>
					Remember me
				</Checkbox>
				<Button colorScheme="red" size="sm" variant="link">
					Forgot password?
				</Button>
			</HStack>
			<Stack spacing="6">
				<Button colorScheme="red" type="submit">
					{t('submit.label')}
				</Button>
			</Stack>
		</Stack>
	);
};
