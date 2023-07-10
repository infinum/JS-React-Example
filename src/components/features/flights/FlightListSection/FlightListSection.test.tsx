import { FlightListSection } from './FlightListSection';
import { render } from 'test-utils';

describe('FlightListSection', () => {
	it('should render title', () => {
		const { getByText } = render(<FlightListSection />);

		expect(getByText('title')).toBeInTheDocument();
	});

	it('should render children', () => {
		const { getByText } = render(<FlightListSection>test</FlightListSection>);

		expect(getByText('test')).toBeInTheDocument();
	});
});
