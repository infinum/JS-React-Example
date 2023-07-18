import { MOCKED_URLS, handlerOverrides } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import { useColorMode } from '@chakra-ui/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { render, screen, waitFor, within } from 'test-utils';
import { MainNavigation } from './MainNavigation';
import { rest } from 'msw';
import routerMock from 'next/router';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';

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

routerMock.locales = ['en-US'];

describe('MainNavigation', () => {
	const user = userEvent.setup();

	it('should matches snapshot', () => {
		const { asFragment } = render(<MainNavigation />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should be accessible', async () => {
		const { container } = render(<MainNavigation />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
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

	it('should render locale selection menu', async () => {
		render(
			<MemoryRouterProvider>
				<MainNavigation />
			</MemoryRouterProvider>
		);

		const languageButton = screen.getByRole('button', { name: /Toggle language/i });

		expect(languageButton).toBeInTheDocument();

		await user.click(languageButton);

		const languageMenu = screen.getByRole('menu');

		expect(languageMenu).toBeInTheDocument();

		expect(within(languageMenu).getByRole('menuitem')).toBeInTheDocument();
	});

	describe('when user is logged in', () => {
		beforeEach(() => {
			server.use(handlerOverrides.activeCurrentSession);
		});

		it('should render User menu', async () => {
			render(<MainNavigation />);

			await waitFor(() => {
				expect(screen.getByRole('button', { name: /User settings/i })).toBeInTheDocument();
			});
		});

		it('should trigger logout request', async () => {
			render(<MainNavigation />);

			await waitFor(() => {
				expect(screen.getByRole('button', { name: /User settings/i })).toBeInTheDocument();
			});

			await user.click(screen.getByRole('button', { name: /User settings/i }));

			const logoutButton = screen.getByText('auth.logout.label');

			expect(logoutButton).toBeInTheDocument();

			await user.click(logoutButton);

			expect(logoutButton).not.toBeInTheDocument();
			expect(screen.queryByRole('button', { name: /User settings/i })).not.toBeInTheDocument();
		});

		it('should display error from API on failed logout', async () => {
			server.use(
				rest.delete(MOCKED_URLS.SessionMe, (req, res, ctx) => {
					return res(
						ctx.status(401),
						ctx.json({
							errors: [
								{
									status: 'unauthorized',
									code: 'UNAUTHORIZED',
									title: 'Unauthorized',
									detail: 'Must be logged in to perform this action',
								},
							],
						})
					);
				})
			);

			render(<MainNavigation />);

			await waitFor(() => {
				expect(screen.getByRole('button', { name: /User settings/i })).toBeInTheDocument();
			});

			await user.click(screen.getByRole('button', { name: /User settings/i }));

			const logoutButton = screen.getByText('auth.logout.label');

			expect(logoutButton).toBeInTheDocument();

			await user.click(logoutButton);

			expect(screen.getByText('Must be logged in to perform this action')).toBeInTheDocument();
		});

		it('should display fetch error on failed logout', async () => {
			server.use(
				rest.delete(MOCKED_URLS.SessionMe, (req, res) => {
					return res.networkError('Must be logged in to perform this action');
				})
			);

			render(<MainNavigation />);

			await waitFor(() => {
				expect(screen.getByRole('button', { name: /User settings/i })).toBeInTheDocument();
			});

			await user.click(screen.getByRole('button', { name: /User settings/i }));

			const logoutButton = screen.getByText('auth.logout.label');

			expect(logoutButton).toBeInTheDocument();

			await user.click(logoutButton);

			expect(
				screen.getByText(
					'request to http://api.example.com/sessions/me failed, reason: Must be logged in to perform this action'
				)
			).toBeInTheDocument();
		});
	});
});
