import { axe } from 'jest-axe';
import { render, screen } from 'test-utils';
import { AuthLayout } from './AuthLayout';

describe('AuthLayout', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<AuthLayout />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should render children', () => {
		render(
			<AuthLayout>
				<p>test</p>
			</AuthLayout>
		);

		expect(screen.getByText('test')).toBeInTheDocument();
	});

	it('should be accessible', async () => {
		const { container } = render(<AuthLayout />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});
});
