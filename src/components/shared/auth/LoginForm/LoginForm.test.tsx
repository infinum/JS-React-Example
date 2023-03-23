import { axe } from 'jest-axe';

import userEvent from '@testing-library/user-event';
import { render, screen } from 'test-utils';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<LoginForm />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should be accessible', async () => {
		const { container } = render(<LoginForm />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});

	it('should be accessible with form errors', async () => {
		const user = userEvent.setup();
		const { container } = render(<LoginForm />);

		const submitButton = screen.queryByRole('button', { name: /submit\.label/i });

		if (submitButton) user.click(submitButton);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});
});
