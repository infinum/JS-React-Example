import { render, screen } from '../scripts/test-utils';
import Home from '@/pages/index';

describe('Home', () => {
	it('renders a heading', () => {
		render(<Home />);
		const hello = screen.getByText('Hello World');

		expect(hello).toBeInTheDocument();
	});
});
