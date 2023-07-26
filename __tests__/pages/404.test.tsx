import NotFound from '@/pages/404';
import { render, screen } from 'test-utils';
import { axe } from 'jest-axe';

describe('NotFound Page', () => {
	it('should be accessible', async () => {
		const { container } = render(<NotFound />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});

	it('should show heading and subheading', () => {
		render(<NotFound />);

		expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: /Error occurred!/i })).toBeInTheDocument();
	});
});
