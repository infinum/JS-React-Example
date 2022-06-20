import { render, screen } from '../scripts/test-utils';
import Home from '@/pages/index';

describe('Home', () => {
	it('renders a heading', () => {
		render(<Home />);

		const heading = screen.getByRole('heading', {
			name: 'Todo',
		});

		expect(heading).toBeInTheDocument();
	});
});
