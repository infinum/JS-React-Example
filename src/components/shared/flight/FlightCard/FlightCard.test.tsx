import { flightFactory } from '__mocks__/factories';
import { axe } from 'jest-axe';
import { render, screen } from 'test-utils';
import { FlightCard, FlightCardFallback } from './FlightCard';

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

	it('should be accessible', async () => {
		const data = flightFactory();

		const { container } = render(<FlightCard flight={data} />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});
});

describe('FlightCardFallback', () => {
	it('should render fallback', () => {
		const { asFragment } = render(<FlightCardFallback />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should be accessible', async () => {
		const { container } = render(<FlightCardFallback />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});
});
