import { render, screen } from '@testing-library/react';

import { Label } from '../label';

describe('Label component', () => {
	it('associates with form controls via htmlFor', () => {
		render(
			<div>
				<Label htmlFor="field">Field label</Label>
				<input id="field" />
			</div>
		);

		const label = screen.getByText('Field label');
		expect(label).toHaveAttribute('for', 'field');
	});

	it('respects custom class names and data attributes', () => {
		render(
			<Label className="text-accent" data-testid="label">
				Content
			</Label>
		);

		const label = screen.getByTestId('label');
		expect(label).toHaveClass('text-accent');
		expect(label).toHaveAttribute('data-slot', 'label');
	});
});
