import React, { FC } from 'react';
import { BoxProps, Button, Checkbox, HStack, Stack } from '@chakra-ui/react';
import { InputField } from '@/components/shared/fields/InputField/InputField';
import { useForm } from 'react-hook-form';
import { getErrors } from '@/utils/form-error';
import { Response } from '@datx/jsonapi';
import { useTranslation } from 'next-i18next';
import { login } from '@/mutations/auth';
import { isCollectionResponse, isSingleResponse, SingleResponse, useClient } from '@datx/swr';
import { useSession } from '@/hooks/use-session';
import { PasswordField } from '@/components/shared/fields/PasswordField/PasswordField';
import { Session } from '@/models/Session';
import { JsonapiDocument } from '@/interfaces/Jsonapi';

interface IFormValues {
	email: string;
	password: string;
}

export const LoginForm: FC<BoxProps> = (props) => {
	const { t } = useTranslation('login-form');
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
					type: 'sessions',
					attributes: formData,
				},
			} satisfies JsonapiDocument<typeof Session>;

			await mutate(() => login(client, data), false);
		} catch (errors) {
			if (isSingleResponse(errors) || isCollectionResponse(errors)) {
				getErrors(errors.error).forEach(({ name, type, message = t<string>('error') }) =>
					setError(name, { type, message })
				);
			}
		}
	}

	return (
		<Stack as="form" noValidate onSubmit={handleSubmit(onSubmit)} spacing="6" {...props}>
			<Stack spacing="5">
				<InputField
					label={t('email.label')}
					errors={errors}
					type="email"
					{...register('email', { required: t<string>('required') })}
				/>
				<PasswordField
					label={t('password.label')}
					errors={errors}
					id="password"
					{...register('password', { required: t<string>('required') })}
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
