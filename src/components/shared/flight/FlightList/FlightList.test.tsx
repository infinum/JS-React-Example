import { FlightList } from '@/components/shared/flight/FlightList/FlightList';
import { buildMany } from '@datx/test-data-factory';
import { TEST_FLIGHT_NAME } from '__mocks__/constants';

import { flightFactory } from '__mocks__/factories';
import { axe } from 'jest-axe';
import { render, screen } from 'test-utils';

describe('FlightList', () => {
	beforeEach(() => {
		flightFactory.reset();
	});

	it('should render flights', () => {
		const data = buildMany(flightFactory, 2);

		render(<FlightList flightList={data} />);

		expect(screen.getAllByText(TEST_FLIGHT_NAME)).toHaveLength(2);
		expect(screen.getAllByText('$100')).toHaveLength(2);
	});

	it('should be accessible', async () => {
		const data = buildMany(flightFactory, 2);

		const { container } = render(<FlightList flightList={data} />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});
});
