import { useTheme } from 'next-themes';
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { render, screen, fireEvent } from '@/tests/utils';

// Mock next-themes
const mockSetTheme = jest.fn();
jest.mock('next-themes', () => ({
	useTheme: jest.fn(),
}));

// Mock UI components
jest.mock('@infinum/ui/components/button', () => ({
	Button: ({ children, onClick, ...props }: any) => (
		<button onClick={onClick} {...props}>
			{children}
		</button>
	),
}));

jest.mock('@infinum/ui/components/tooltip', () => ({
	Tooltip: ({ children }: any) => <div data-testid="tooltip">{children}</div>,
	TooltipTrigger: ({ children }: any) => <div data-testid="tooltip-trigger">{children}</div>,
	TooltipContent: ({ children }: any) => <div data-testid="tooltip-content">{children}</div>,
}));

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe('ThemeToggle Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockSetTheme.mockClear();
	});

	describe('Initial render (before mounted)', () => {
		beforeEach(() => {
			mockUseTheme.mockReturnValue({
				theme: 'light',
				systemTheme: 'light',
				setTheme: mockSetTheme,
				resolvedTheme: 'light',
				themes: ['light', 'dark'],
			});
		});

		it('renders default sun icon before mounting', () => {
			render(<ThemeToggle />);

			const button = screen.getByRole('button');
			expect(button).toHaveTextContent('🌞');
		});

		it('renders tooltip structure before mounting', () => {
			render(<ThemeToggle />);

			expect(screen.getByTestId('tooltip')).toBeInTheDocument();
			expect(screen.getByTestId('tooltip-trigger')).toBeInTheDocument();
			expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
			expect(screen.getByText('Switch theme')).toBeInTheDocument();
		});

		it('forwards props to button before mounting', () => {
			render(<ThemeToggle data-testid="theme-button" className="custom-class" />);

			const button = screen.getByRole('button');
			expect(button).toHaveAttribute('data-testid', 'theme-button');
			expect(button).toHaveClass('custom-class');
		});
	});

	describe('After mounted state', () => {
		beforeEach(() => {
			// Mock useEffect to simulate mounted state
			const mockUseEffect = jest.spyOn(React, 'useEffect');
			mockUseEffect.mockImplementation((effect: any) => {
				if (typeof effect === 'function') {
					effect();
				}
			});

			const mockUseState = jest.spyOn(React, 'useState');
			mockUseState.mockImplementation(((initial: any) => {
				if (initial === false) {
					return [true, jest.fn()]; // mounted = true
				}
				return [initial, jest.fn()];
			}) as any);
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('displays light theme icon correctly', () => {
			mockUseTheme.mockReturnValue({
				theme: 'light',
				systemTheme: 'light',
				setTheme: mockSetTheme,
				resolvedTheme: 'light',
				themes: ['light', 'dark'],
			});

			render(<ThemeToggle />);

			const button = screen.getByRole('button');
			expect(button).toHaveTextContent('🌞');
		});

		it('displays dark theme icon correctly', () => {
			mockUseTheme.mockReturnValue({
				theme: 'dark',
				systemTheme: 'dark',
				setTheme: mockSetTheme,
				resolvedTheme: 'dark',
				themes: ['light', 'dark'],
			});

			render(<ThemeToggle />);

			const button = screen.getByRole('button');
			expect(button).toHaveTextContent('🌙');
		});

		it('displays rainbow theme icon correctly', () => {
			mockUseTheme.mockReturnValue({
				theme: 'rainbow',
				systemTheme: 'light',
				setTheme: mockSetTheme,
				resolvedTheme: 'rainbow',
				themes: ['light', 'dark', 'rainbow'],
			});

			render(<ThemeToggle />);

			const button = screen.getByRole('button');
			expect(button).toHaveTextContent('🌈');
		});

		it('resolves system theme correctly when theme is system', () => {
			mockUseTheme.mockReturnValue({
				theme: 'system',
				systemTheme: 'dark',
				setTheme: mockSetTheme,
				resolvedTheme: 'dark',
				themes: ['light', 'dark'],
			});

			render(<ThemeToggle />);

			const button = screen.getByRole('button');
			expect(button).toHaveTextContent('🌙'); // Should show dark icon
		});
	});

	describe('Theme switching functionality', () => {
		beforeEach(() => {
			// Mock mounted state
			const mockUseEffect = jest.spyOn(React, 'useEffect');
			mockUseEffect.mockImplementation((effect: any) => {
				if (typeof effect === 'function') {
					effect();
				}
			});

			const mockUseState = jest.spyOn(React, 'useState');
			mockUseState.mockImplementation(((initial: any) => {
				if (initial === false) {
					return [true, jest.fn()]; // mounted = true
				}
				return [initial, jest.fn()];
			}) as any);
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('switches from light to dark theme', () => {
			mockUseTheme.mockReturnValue({
				theme: 'light',
				systemTheme: 'light',
				setTheme: mockSetTheme,
				resolvedTheme: 'light',
				themes: ['light', 'dark'],
			});

			render(<ThemeToggle />);

			const button = screen.getByRole('button');
			fireEvent.click(button);

			expect(mockSetTheme).toHaveBeenCalledWith('dark');
		});

		it('switches from dark to rainbow theme', () => {
			mockUseTheme.mockReturnValue({
				theme: 'dark',
				systemTheme: 'dark',
				setTheme: mockSetTheme,
				resolvedTheme: 'dark',
				themes: ['light', 'dark'],
			});

			render(<ThemeToggle />);

			const button = screen.getByRole('button');
			fireEvent.click(button);

			expect(mockSetTheme).toHaveBeenCalledWith('rainbow');
		});

		it('switches from rainbow back to light theme (cycle completion)', () => {
			mockUseTheme.mockReturnValue({
				theme: 'rainbow',
				systemTheme: 'light',
				setTheme: mockSetTheme,
				resolvedTheme: 'rainbow',
				themes: ['light', 'dark'],
			});

			render(<ThemeToggle />);

			const button = screen.getByRole('button');
			fireEvent.click(button);

			expect(mockSetTheme).toHaveBeenCalledWith('light');
		});

		it('calls setTheme only once per click', () => {
			mockUseTheme.mockReturnValue({
				theme: 'light',
				systemTheme: 'light',
				setTheme: mockSetTheme,
				resolvedTheme: 'light',
				themes: ['light', 'dark'],
			});

			render(<ThemeToggle />);

			const button = screen.getByRole('button');
			fireEvent.click(button);
			fireEvent.click(button);

			expect(mockSetTheme).toHaveBeenCalledTimes(2);
		});
	});

	describe('Props forwarding and accessibility', () => {
		beforeEach(() => {
			mockUseTheme.mockReturnValue({
				theme: 'light',
				systemTheme: 'light',
				setTheme: mockSetTheme,
				resolvedTheme: 'light',
				themes: ['light', 'dark'],
			});
		});

		it('forwards custom props to button', () => {
			render(<ThemeToggle data-testid="custom-theme-toggle" className="custom-class" disabled />);

			const button = screen.getByRole('button');
			expect(button).toHaveAttribute('data-testid', 'custom-theme-toggle');
			expect(button).toHaveClass('custom-class');
			expect(button).toBeDisabled();
		});

		it('handles theme switching when mounted', () => {
			// Mock mounted state
			const mockUseEffect = jest.spyOn(React, 'useEffect');
			mockUseEffect.mockImplementation((effect: any) => {
				if (typeof effect === 'function') {
					effect();
				}
			});

			const mockUseState = jest.spyOn(React, 'useState');
			mockUseState.mockImplementation(((initial: any) => {
				if (initial === false) {
					return [true, jest.fn()]; // mounted = true
				}
				return [initial, jest.fn()];
			}) as any);

			// Ensure the mock is properly set up for this test
			mockUseTheme.mockReturnValue({
				theme: 'light',
				systemTheme: 'light',
				setTheme: mockSetTheme,
				resolvedTheme: 'light',
				themes: ['light', 'dark'],
			});

			render(<ThemeToggle />);

			const button = screen.getByRole('button');
			fireEvent.click(button);

			// Should call theme switch
			expect(mockSetTheme).toHaveBeenCalledWith('dark');
		});

		it('renders tooltip content correctly', () => {
			render(<ThemeToggle />);

			expect(screen.getByText('Switch theme')).toBeInTheDocument();
		});
	});
});
