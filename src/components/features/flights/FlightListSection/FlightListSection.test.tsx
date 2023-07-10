import { FlightListSection } from './FlightListSection';
import { render, screen } from 'test-utils';

describe('FlightListSection', () => {
	it('should render title', () => {
		render(<FlightListSection />);

		expect(screen.getByText('title')).toBeInTheDocument();
	});

	it('should render children', () => {
		render(<FlightListSection>test</FlightListSection>);

		expect(screen.getByText('test')).toBeInTheDocument();
	});
});
