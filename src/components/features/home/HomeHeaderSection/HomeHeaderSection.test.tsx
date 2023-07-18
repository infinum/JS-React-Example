import { HomeHeaderSection } from '@/components/features/home/HomeHeaderSection/HomeHeaderSection';
import { render, screen } from 'test-utils';
import { axe } from 'jest-axe';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

const WithRouterHomeHeaderSection = () => (
	<MemoryRouterProvider>
		<HomeHeaderSection />
	</MemoryRouterProvider>
);

describe('HomeHeaderSection', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<HomeHeaderSection />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should be accessible', async () => {
		const { container } = render(<HomeHeaderSection />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});

	it('should link user to /flights', async () => {
		render(<WithRouterHomeHeaderSection />);

		const checkFlights = screen.getByRole('link');

		await user.click(checkFlights);

		expect(mockRouter.asPath).toEqual('/flights');
	});
});
