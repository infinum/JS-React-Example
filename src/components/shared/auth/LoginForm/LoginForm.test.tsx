import { createClient } from '@/datx/create-client';
import { MOCKED_URLS, handlerOverrides } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import { DatxProvider, useInitialize } from '@datx/swr';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { FC } from 'react';
import { render, screen } from 'test-utils';
import { LoginForm } from './LoginForm';
import { FormProvider, useForm } from 'react-hook-form';
import { rest } from 'msw';
import { sessionFactory } from '__mocks__/factories';
import { invalidEmailMessage, invalidPasswordMessage } from '__mocks__/errors';

const user = userEvent.setup();

const TestLoginForm: FC = () => {
	const methods = useForm();

	return (
		<DatxProvider client={useInitialize(createClient)}>
			<FormProvider {...methods}>
				<LoginForm />
			</FormProvider>
		</DatxProvider>
	);
};

describe('LoginForm', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<TestLoginForm />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should be accessible', async () => {
		const { container } = render(<TestLoginForm />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});

	it('should be accessible with form errors', async () => {
		const { container } = render(<TestLoginForm />);

		await triggerSubmit();

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});

	it('should display required error when value is invalid', async () => {
		render(<TestLoginForm />);

		await triggerSubmit();

		expect(screen.getAllByText('required')).toHaveLength(2);
	});

	it('should not display error when value is valid', async () => {
		server.use(
			rest.post(MOCKED_URLS.Session, async (req, res, ctx) => {
				const body = await req.json();
				const emailOverride = body.data?.attributes?.email || undefined;

				return res(
					ctx.status(200),
					ctx.json(
						sessionFactory({
							overrides: {
								email: emailOverride,
							},
						})
					)
				);
			})
		);

		render(<TestLoginForm />);

		const emailValue = 'test@infinum.com';
		const passwordValue = 'password';

		await user.type(screen.getByRole('textbox', { name: /email/i }), emailValue);
		await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), passwordValue);

		await triggerSubmit();

		expect(screen.queryByText(invalidEmailMessage)).not.toBeInTheDocument();
		expect(screen.queryByText(invalidPasswordMessage)).not.toBeInTheDocument();
	});

	it('should display wrong Email error', async () => {
		server.use(handlerOverrides.invalidEmailLogin);

		render(<TestLoginForm />);

		const emailValue = 'test@infinum.com';
		const passwordValue = 'password';

		await user.type(screen.getByRole('textbox', { name: /email/i }), emailValue);
		await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), passwordValue);

		await triggerSubmit();

		expect(screen.getByText(invalidEmailMessage)).toBeInTheDocument();
	});

	it('should display wrong Email error', async () => {
		server.use(handlerOverrides.invalidPasswordLogin);

		render(<TestLoginForm />);

		const emailValue = 'test@infinum.com';
		const passwordValue = 'password';

		await user.type(screen.getByRole('textbox', { name: /email/i }), emailValue);
		await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), passwordValue);

		await triggerSubmit();

		expect(screen.getByText(invalidPasswordMessage)).toBeInTheDocument();
	});
});

const triggerSubmit = async () => {
	const submitButton = screen.queryByRole('button', { name: /submit\.label/i });

	if (submitButton) {
		await user.click(submitButton);
	}
};
