import { axe } from 'jest-axe';
import { FC } from 'react';

import { createClient } from '@/datx/create-client';
import { DatxProvider, useInitialize } from '@datx/swr';
import userEvent from '@testing-library/user-event';
import { act, render, screen } from 'test-utils';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
	let UI: FC;

	beforeAll(() => {
		UI = () => (
			<DatxProvider client={useInitialize(createClient)}>
				<LoginForm />
			</DatxProvider>
		);
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
		const user = userEvent.setup();
		const { container } = render(<UI />);

		const submitButton = screen.queryByRole('button', { name: /submit\.label/i });
		await act(() => user.click(submitButton));

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});
});
