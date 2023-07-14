import { createClient } from '@/datx/create-client';
import { MOCKED_URLS, handlerOverrides } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import { DatxProvider, useInitialize } from '@datx/swr';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { FC } from 'react';
import { render, screen, waitFor, waitForRequest } from 'test-utils';
import { LoginForm } from './LoginForm';

const user = userEvent.setup();

describe('LoginForm', () => {
	let UI: FC;

	beforeAll(() => {
		UI = function UI() {
			return (
				<DatxProvider client={useInitialize(createClient)}>
					<LoginForm />
				</DatxProvider>
			);
		};
	});

	it('should matches snapshot', () => {
		const { asFragment } = render(<UI />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should be accessible', async () => {
		const { container } = render(<UI />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});

	it('should be accessible with form errors', async () => {
		const { container } = render(<UI />);

		await triggerSubmit();

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});

	it('should display required error when value is invalid', async () => {
		const { container } = render(<UI />);

		await triggerSubmit();

		expect(getErrorMessageElements(container)).toHaveLength(2);
	});

	it('should not display error when value is valid', async () => {
		const { container } = render(<UI />);

		const pendingRequest = waitForRequest.post(MOCKED_URLS.Session);

		const emailValue = 'test@infinum.com';
		const passwordValue = 'password';

		await user.type(screen.getByRole('textbox', { name: /email/i }), emailValue);
		await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), passwordValue);
		await triggerSubmit();

		await waitFor(() => {
			expect(getErrorMessageElements(container)).toHaveLength(0);
		});

		const request = await pendingRequest;

		expect((await request.json())?.data?.attributes).toEqual({
			email: emailValue,
			password: passwordValue,
		});
	});

	it('should display error from API', async () => {
		const { container } = render(<UI />);

		server.use(handlerOverrides.invalidLogin);

		const emailValue = 'test@infinum.com';
		const passwordValue = 'password';

		await user.type(screen.getByRole('textbox', { name: /email/i }), emailValue);
		await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), passwordValue);
		await triggerSubmit();

		await waitFor(() => {
			expect(getErrorMessageElements(container)).toHaveLength(1);
		});
	});
});

const triggerSubmit = async () => {
	const submitButton = screen.queryByRole('button', { name: /submit\.label/i });

	if (submitButton) {
		await user.click(submitButton);
	}
};

const getErrorMessageElements = (container: HTMLElement) => {
	// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
	return container.querySelectorAll('[aria-live]');
};
