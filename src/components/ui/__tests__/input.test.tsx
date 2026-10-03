import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from '../input';

describe('Input component', () => {
	it('renders with placeholder and custom classes', () => {
		render(<Input placeholder="Email" className="custom-input" data-testid="input-element" />);

		const input = screen.getByPlaceholderText('Email');
		expect(input).toHaveClass('custom-input');
		expect(input).toHaveAttribute('data-slot', 'input');
	});

	it('accepts user input and forwards native props', async () => {
		const handleChange = jest.fn();
		const user = userEvent.setup();

		render(<Input aria-invalid="true" onChange={handleChange} />);

		const input = screen.getByRole('textbox');
		await user.type(input, 'Hello');

		expect(handleChange).toHaveBeenCalled();
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveValue('Hello');
	});
});
