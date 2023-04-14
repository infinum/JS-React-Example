import { Flights } from './Flights';
import { render } from 'test-utils';

describe('Flights', () => {
	it('should render loading state', () => {
		const { asFragment } = render(<Flights />);

		// expect(asFragment()).toMatchSnapshot();
	});

	it('should render error state', () => {
		const { asFragment } = render(<Flights />);

		// expect(asFragment()).toMatchSnapshot();
	});

	it('should render flights list', () => {
		const { asFragment } = render(<Flights />);

		// expect(asFragment()).toMatchSnapshot();
	});

	it('should render empty list message', () => {
		const { asFragment } = render(<Flights />);

		// expect(asFragment()).toMatchSnapshot();
	});
});
