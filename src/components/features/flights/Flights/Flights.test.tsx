import { Flights } from './Flights';
import { render, screen } from 'test-utils';

const mockFlightList = jest.fn();
const mockFlightListFallbackMessage = 'FlightListFallback';
const mockFlightListFallback = jest.fn(() => mockFlightListFallbackMessage);

jest.mock('@/components/shared/flight/FlightList/FlightList', () => ({
	FlightList: () => mockFlightList,
	FlightListFallback: () => mockFlightListFallback(),
}));

describe('Flights', () => {
	it('should render loading state', () => {
		render(<Flights />);

		expect(mockFlightListFallback).toHaveBeenCalled();
		expect(screen.getByText(mockFlightListFallbackMessage)).toBeDefined();
	});

	it('should render error state', () => {
		const { asFragment } = render(<Flights />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should render flights list', () => {
		const { asFragment } = render(<Flights />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should render empty list message', () => {
		const { asFragment } = render(<Flights />);

		expect(asFragment()).toMatchSnapshot();
	});
});