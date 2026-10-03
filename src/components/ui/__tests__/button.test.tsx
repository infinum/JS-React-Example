import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button Component', () => {
	it('renders with default props', () => {
		render(<Button>Click me</Button>);

		const button = screen.getByRole('button', { name: /click me/i });
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass('bg-primary');
		expect(button).toHaveClass('h-9');
	});

	it('renders different variants', () => {
		const { rerender } = render(<Button variant="destructive">Delete</Button>);

		let button = screen.getByRole('button');
		expect(button).toHaveClass('bg-destructive');

		rerender(<Button variant="outline">Outline</Button>);
		button = screen.getByRole('button');
		expect(button).toHaveClass('border');

		rerender(<Button variant="ghost">Ghost</Button>);
		button = screen.getByRole('button');
		expect(button).toHaveClass('hover:bg-accent');
	});

	it('renders different sizes', () => {
		const { rerender } = render(<Button size="sm">Small</Button>);

		let button = screen.getByRole('button');
		expect(button).toHaveClass('h-8');

		rerender(<Button size="lg">Large</Button>);
		button = screen.getByRole('button');
		expect(button).toHaveClass('h-10');

		rerender(<Button size="icon">Icon</Button>);
		button = screen.getByRole('button');
		expect(button).toHaveClass('size-9');
	});

	it('handles click events', async () => {
		const handleClick = jest.fn();
		const user = userEvent.setup();

		render(<Button onClick={handleClick}>Click me</Button>);

		const button = screen.getByRole('button');
		await user.click(button);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('is disabled when disabled prop is true', () => {
		render(<Button disabled>Disabled</Button>);

		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
		expect(button).toHaveClass('disabled:opacity-50');
	});

	it('renders as child component when asChild is true', () => {
		render(
			<Button asChild>
				<a href="/test">Link Button</a>
			</Button>
		);

		const link = screen.getByRole('link', { name: /link button/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', '/test');
	});

	it('applies custom className', () => {
		render(<Button className="custom-class">Custom</Button>);

		const button = screen.getByRole('button');
		expect(button).toHaveClass('custom-class');
	});

	it('forwards additional props', () => {
		render(
			<Button data-testid="custom-button" aria-label="Custom label">
				Test
			</Button>
		);

		const button = screen.getByTestId('custom-button');
		expect(button).toHaveAttribute('aria-label', 'Custom label');
	});
});
