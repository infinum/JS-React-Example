// import userEvent from '@testing-library/user-event';
import { Login } from '@/components/features/login/Login/Login';
import { render } from 'test-utils';
import { axe } from 'jest-axe';

describe('Login', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<Login />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should be accessible', async () => {
		const { container } = render(<Login />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});
});
