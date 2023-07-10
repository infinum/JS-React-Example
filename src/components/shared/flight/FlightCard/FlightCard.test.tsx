import { render, screen } from 'test-utils';
import { flightFactory } from '__mocks__/factories';
import { FlightCard } from '@/components/shared/flight/FlightCard/FlightCard';

describe('FlightCard', () => {
	beforeEach(() => {
		flightFactory.reset();
	});

	it('should render flights', () => {
		const data = flightFactory();

		render(<FlightCard flight={data} />);

		expect(screen.getByText(data.name)).toBeInTheDocument();
		expect(screen.getByText(`$${data.currentSeatPrice}`)).toBeInTheDocument();
	});
});
