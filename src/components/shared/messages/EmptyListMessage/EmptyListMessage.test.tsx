import { axe } from 'jest-axe';

import { render } from 'test-utils';
import { EmptyListMessage } from './EmptyListMessage';

describe('EmptyListMessage', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<EmptyListMessage />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should be accessible', async () => {
		const { container } = render(<EmptyListMessage />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});
});
