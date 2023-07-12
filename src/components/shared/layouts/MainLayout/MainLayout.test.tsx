import { axe } from 'jest-axe';
import { act } from 'react-dom/test-utils';
import { render, screen } from 'test-utils';
import { MainLayout } from './MainLayout';

describe('MainLayout', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<MainLayout />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should render children', () => {
		-render(
			<MainLayout>
				<p>test</p>
			</MainLayout>
		);

		expect(screen.getByText('test')).toBeInTheDocument();
	});

	it('should be accessible', async () => {
		const { container } = render(<MainLayout />);

		await act(async () => {
			const results = await axe(container);

			expect(results).toHaveNoViolations();
		});
	});
});
