import { AuthRedirect, IAuthRedirectProps } from '@/components/shared/utilities/AuthRedirect/AuthRedirect';
import { FC } from 'react';
import { render, waitFor } from 'test-utils';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import mockRouter from 'next-router-mock';
import { server } from '@/mocks/server';
import { MOCKED_URLS, handlerOverrides } from '@/mocks/handlers';
import { rest } from 'msw';

const TestAuthRedirect: FC<IAuthRedirectProps> = ({ to = '/', ifFound = true }) => (
	<MemoryRouterProvider>
		<AuthRedirect to={to} ifFound={ifFound} />
	</MemoryRouterProvider>
);

describe('AuthRedirect', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<TestAuthRedirect to="/" ifFound />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should redirect logged in user', async () => {
		server.use(handlerOverrides.activeCurrentSession);

		mockRouter.push('/login');

		render(<TestAuthRedirect to="/" ifFound />);

		await waitFor(() => {
			expect(mockRouter.asPath).toEqual('/');
		});
	});

	it('should redirect based on condition', async () => {
		server.use(
			rest.get(MOCKED_URLS.SessionCurrent, (req, res, ctx) => {
				return res(
					ctx.status(200),
					ctx.json({
						data: {
							id: 'current',
							type: 'session',
							attributes: {
								email: 'admin@infinum.com',
							},
						},
					})
				);
			})
		);

		mockRouter.push('/login');

		render(<TestAuthRedirect to="/admin" condition={(session) => session?.email === 'admin@infinum.com'} />);

		await waitFor(() => {
			expect(mockRouter.asPath).toEqual('/admin');
		});
	});
});
