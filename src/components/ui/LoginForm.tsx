import styled from '@emotion/styled';
import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';

const Title = styled.h1``;

const Error = styled.p`
	padding: 4px 8px;
	color: red;
`;

interface ILoginFormProps {
	onSubmit({ email, password }: { email: string; password: string }): void;
	apiErrors?: string;
}

export const LoginForm = ({ onSubmit, apiErrors }: ILoginFormProps): ReactElement => {
	const { handleSubmit, register, errors } = useForm();

	return (
		<>
			<Title>Login</Title>
			<form onSubmit={handleSubmit(onSubmit)}>
				{apiErrors && <Error>{apiErrors}</Error>}

				<input
					name="email"
					ref={register({
						required: 'Required',
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: 'invalid email address',
						},
					})}
				/>

				{errors.email && <Error>{errors.email.message}</Error>}

				<input
					name="password"
					type="password"
					ref={register({
						required: 'Required',
					})}
				/>

				{errors.password && <Error>{errors.password.message}</Error>}

				<button type="submit">Log in</button>
			</form>
		</>
	);
};
