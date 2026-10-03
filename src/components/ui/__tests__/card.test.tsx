import { render, screen } from '@testing-library/react';

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card';
import { Button } from '../button';

describe('Card component suite', () => {
	it('renders all structural slots with custom classNames', () => {
		render(
			<Card className="test-card" data-testid="card-root">
				<CardHeader className="header-slot">
					<CardTitle>Plan</CardTitle>
					<CardDescription>Choose the perfect plan</CardDescription>
					<CardAction>
						<Button>Primary action</Button>
					</CardAction>
				</CardHeader>
				<CardContent className="content-slot">Card body content</CardContent>
				<CardFooter className="footer-slot">Footer CTA</CardFooter>
			</Card>
		);

		expect(screen.getByTestId('card-root')).toHaveClass('test-card');
		expect(screen.getByText('Plan')).toHaveAttribute('data-slot', 'card-title');
		expect(screen.getByText('Choose the perfect plan')).toHaveAttribute('data-slot', 'card-description');
		expect(screen.getByRole('button', { name: /primary action/i })).toBeInTheDocument();
		expect(screen.getByText('Card body content')).toHaveClass('content-slot');
		expect(screen.getByText('Footer CTA')).toHaveClass('footer-slot');
	});

	it('forwards arbitrary props down to the DOM nodes', () => {
		render(
			<Card id="pricing-card" aria-label="Pricing overview">
				<CardContent>Details</CardContent>
			</Card>
		);

		const card = screen.getByLabelText('Pricing overview');
		expect(card).toHaveAttribute('id', 'pricing-card');
	});
});
