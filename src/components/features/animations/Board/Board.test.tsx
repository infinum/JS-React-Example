import { axe } from 'jest-axe';
import { render } from 'test-utils';
import { Board } from './Board';

describe('Board', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<Board />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should be accessible', async () => {
		const { container } = render(<Board />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});
});
