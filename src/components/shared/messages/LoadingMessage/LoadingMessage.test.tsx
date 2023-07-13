import { axe } from 'jest-axe';

import { render } from 'test-utils';
import { LoadingMessage } from './LoadingMessage';

describe('LoadingMessage', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<LoadingMessage />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should be accessible', async () => {
		const { container } = render(<LoadingMessage />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});
});
