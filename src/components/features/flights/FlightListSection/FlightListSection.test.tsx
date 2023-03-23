import { FlightListSection } from '@/components/features/flights/FlightListSection/FlightListSection';

import { render, screen, waitForElementToBeRemoved } from 'test-utils';
import { server } from '../../../../../.msw/server';

describe('FlightList', () => {
	beforeAll(() =>
		server.listen({
			onUnhandledRequest: 'error',
		})
	);

	it('should render flight list section', async () => {
		render(<FlightListSection />);

		await waitForElementToBeRemoved(() => screen.getAllByText('Loading'));

		expect(screen.getAllByText('Air Force One')).toHaveLength(2);
		expect(screen.getAllByText('$100')).toHaveLength(2);
	});
});
