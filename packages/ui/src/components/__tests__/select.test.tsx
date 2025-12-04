import { render, screen } from '@testing-library/react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '../select';

describe('Select Component', () => {
	it('renders Select with data-slot attribute', () => {
		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Choose an option" />
				</SelectTrigger>
			</Select>
		);

		const select = screen.getByRole('combobox');
		expect(select).toBeInTheDocument();
		expect(select).toHaveAttribute('data-slot', 'select-trigger');
	});

	it('renders SelectTrigger with default size', () => {
		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
			</Select>
		);

		const trigger = screen.getByRole('combobox');
		expect(trigger).toHaveClass('data-[size=default]:h-9');
		expect(trigger).toHaveAttribute('data-size', 'default');
	});

	it('renders SelectTrigger with small size', () => {
		render(
			<Select>
				<SelectTrigger size="sm">
					<SelectValue placeholder="Select" />
				</SelectTrigger>
			</Select>
		);

		const trigger = screen.getByRole('combobox');
		expect(trigger).toHaveClass('data-[size=sm]:h-8');
		expect(trigger).toHaveAttribute('data-size', 'sm');
	});

	it('applies custom className to SelectTrigger', () => {
		render(
			<Select>
				<SelectTrigger className="custom-trigger">
					<SelectValue placeholder="Select" />
				</SelectTrigger>
			</Select>
		);

		const trigger = screen.getByRole('combobox');
		expect(trigger).toHaveClass('custom-trigger');
	});

	it('renders SelectValue with placeholder', () => {
		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Choose option" />
				</SelectTrigger>
			</Select>
		);

		expect(screen.getByText('Choose option')).toBeInTheDocument();
	});

	it('renders SelectItem with data-slot attribute', () => {
		render(
			<Select open>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option1">Option 1</SelectItem>
				</SelectContent>
			</Select>
		);

		const item = screen.getByText('Option 1');
		expect(item).toBeInTheDocument();
		expect(item.closest('[data-slot="select-item"]')).toBeInTheDocument();
	});

	it('renders SelectLabel with data-slot attribute', () => {
		render(
			<Select open>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Category</SelectLabel>
						<SelectItem value="opt1">Option 1</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		);

		const label = screen.getByText('Category');
		expect(label).toBeInTheDocument();
		expect(label).toHaveAttribute('data-slot', 'select-label');
	});

	it('renders SelectGroup with data-slot attribute', () => {
		render(
			<Select open>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Group 1</SelectLabel>
						<SelectItem value="opt1">Option 1</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		);

		const group = screen.getByText('Group 1').closest('[data-slot="select-group"]');
		expect(group).toBeInTheDocument();
	});

	it('renders SelectSeparator with data-slot attribute', () => {
		render(
			<Select open>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="opt1">Option 1</SelectItem>
					<SelectSeparator />
					<SelectItem value="opt2">Option 2</SelectItem>
				</SelectContent>
			</Select>
		);

		const separator = document.querySelector('[data-slot="select-separator"]');
		expect(separator).toBeInTheDocument();
		expect(separator).toHaveAttribute('data-slot', 'select-separator');
	});

	it('forwards additional props to SelectTrigger', () => {
		render(
			<Select>
				<SelectTrigger data-testid="custom-select" aria-label="Custom select">
					<SelectValue placeholder="Select" />
				</SelectTrigger>
			</Select>
		);

		const trigger = screen.getByTestId('custom-select');
		expect(trigger).toHaveAttribute('aria-label', 'Custom select');
	});
});
