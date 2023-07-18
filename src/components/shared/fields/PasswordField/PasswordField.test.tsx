import { PasswordField } from '@/components/shared/fields/PasswordField/PasswordField';
import { FC } from 'react';
import { render, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';

const label = 'Test Label';
const name = 'Test Name';

const TestPasswordField: FC = () => {
	return <PasswordField label={label} name={name} />;
};

describe('PasswordField', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<TestPasswordField />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should render correct label', () => {
		render(<TestPasswordField />);

		expect(screen.getByText(label)).toBeInTheDocument();
	});

	it('should render correct name', () => {
		render(<TestPasswordField />);

		const passwordField = screen.getByLabelText(label);

		expect(passwordField).toHaveAttribute('name', name);
	});

	it('should toggle password visibility', async () => {
		const user = userEvent.setup();

		render(<TestPasswordField />);

		const toggleVisibilityButton = screen.getByRole('button', { name: /Reveal password/i });
		const passwordField = screen.getByLabelText(label);

		expect(toggleVisibilityButton).toBeInTheDocument();
		expect(passwordField).toHaveAttribute('type', 'password');

		await user.click(toggleVisibilityButton);

		expect(toggleVisibilityButton).toHaveAccessibleName('Mask password');
		expect(passwordField).toHaveAttribute('type', 'text');
	});
});
