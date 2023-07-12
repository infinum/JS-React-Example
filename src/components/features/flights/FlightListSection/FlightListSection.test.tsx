import { axe } from 'jest-axe';
import { render, screen } from 'test-utils';
import { FlightListSection } from './FlightListSection';

describe('FlightListSection', () => {
	it('should render title', () => {
		render(<FlightListSection />);

		expect(screen.getByText('title')).toBeInTheDocument();
	});

	it('should render children', () => {
		render(<FlightListSection>test</FlightListSection>);

		expect(screen.getByText('test')).toBeInTheDocument();
	});

	it('should be accessible', async () => {
		const { container } = render(<FlightListSection />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});
});
