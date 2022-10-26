import React from 'react';
import { axe } from 'jest-axe';

import { Card } from './Card';
import { render } from 'test-utils';

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
