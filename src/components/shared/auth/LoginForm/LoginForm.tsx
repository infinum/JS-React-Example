import { InputField } from '@/components/shared/fields/InputField/InputField';
import { PasswordField } from '@/components/shared/fields/PasswordField/PasswordField';
import { useSession } from '@/hooks/use-session';
import { ILoginData, login } from '@/mutations/auth';
import { getErrors } from '@/utils/form-error';
import { BoxProps, Button, Checkbox, HStack, Stack } from '@chakra-ui/react';
import { Response } from '@datx/jsonapi';
import { useClient } from '@datx/swr';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

export interface ILoginFormValues {
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
	} = useForm<ILoginFormValues>();
	const { mutate } = useSession();
	const client = useClient();

	async function onSubmit(formData: ILoginFormValues) {
		try {
			const data: ILoginData = {
				type: 'sessions',
				attributes: formData,
			};

			await mutate(() => login(client, { data }), false);
		} catch (errors) {
			if (errors instanceof Response) {
				getErrors(errors.error).forEach(({ name, type, message = t('error') }) => {
					if (name === 'email' || name === 'password') {
						setError(name, { type, message });
					}
				});
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
					{...register('email', { required: t('required') })}
				/>
				<PasswordField
					label={t('password.label')}
					errors={errors}
					id="password"
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
