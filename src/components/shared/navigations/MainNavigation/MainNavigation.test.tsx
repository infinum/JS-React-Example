import { handlerOverrides } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import { useColorMode } from '@chakra-ui/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { act } from 'react-dom/test-utils';
import { render, screen } from 'test-utils';
import { MainNavigation } from './MainNavigation';

jest.mock('@chakra-ui/color-mode', () => {
	const originalModule = jest.requireActual('@chakra-ui/color-mode');

	return {
		...originalModule,
		useColorMode: jest.fn(() => ({
			colorMode: 'light',
			toggleColorMode: jest.fn(),
		})),
	};
});

describe('MainNavigation', () => {
	const user = userEvent.setup();

	it('should matches snapshot', () => {
		const { asFragment } = render(<MainNavigation />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should be accessible', async () => {
		const { container } = render(<MainNavigation />);

		await act(async () => {
			const results = await axe(container);

			expect(results).toHaveNoViolations();
		});
	});

	it('should render navigation links', () => {
		render(<MainNavigation />);

		expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /flights/i })).toBeInTheDocument();
	});

	it('should match snapshot in dark mode', () => {
		(useColorMode as jest.Mock).mockReturnValue({
			colorMode: 'dark',
			toggleColorMode: jest.fn(),
		});

		const { asFragment } = render(<MainNavigation />);

		expect(asFragment()).toMatchSnapshot('dark-mode');
	});

	it('should have a toggle color mode button', async () => {
		const mockToggleColorMode = jest.fn();

		(useColorMode as jest.Mock).mockReturnValue({
			colorMode: 'light',
			toggleColorMode: mockToggleColorMode,
		});

		render(<MainNavigation />);

		const toggleButton = screen.getByRole('button', { name: /toggle color mode/i });

		expect(toggleButton).toBeInTheDocument();
		await user.click(toggleButton);

		expect(mockToggleColorMode).toBeCalled();
	});

	describe('when user is logged in', () => {
		beforeEach(() => {
			server.use(handlerOverrides.activeCurrentSession);
		});

		it('should render user menu', () => {
			render(<MainNavigation />);

			expect(screen.getByRole('button', { name: /toggle language/i })).toBeInTheDocument();
		});

		it('should trigger logout request', async () => {
			render(<MainNavigation />);

			await user.click(screen.getByRole('button', { name: /toggle language/i }));

			const logoutButton = screen.getByText('auth.logout.label');

			expect(logoutButton).toBeInTheDocument();
			await user.click(logoutButton);
		});
	});
});
