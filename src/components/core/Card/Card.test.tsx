import { axe } from 'jest-axe';
import { render } from 'test-utils';
import { Card } from './Card';

describe('Card', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<Card />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should be accessible', async () => {
		const { container } = render(<Card />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});
});
