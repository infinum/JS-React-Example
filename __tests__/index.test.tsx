import { axe } from 'jest-axe';
import { render, screen } from 'test-utils';
import Home from '@/app/(todolist)/page';

describe('Home', () => {
	it('renders the todo lists placeholder', () => {
		render(<Home />);

		expect(screen.getByText('TODO')).toBeInTheDocument();
	});

	it('has no accessibility violations', async () => {
		const { container } = render(<Home />);

		expect(await axe(container)).toHaveNoViolations();
	});
});
