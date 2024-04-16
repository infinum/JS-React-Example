import { AuthRedirect, IAuthRedirectProps } from '@/components/shared/utilities/AuthRedirect/AuthRedirect';
import { FC } from 'react';
import { render, waitFor } from 'test-utils';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import mockRouter from 'next-router-mock';
import { server } from '@/mocks/server';
import { MOCKED_URLS, handlerOverrides } from '@/mocks/handlers';
import { HttpResponse, http } from 'msw';

export const TestAuthRedirect: FC<IAuthRedirectProps> = ({ to = '/', ifFound = true }) => (
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

		await mockRouter.push('/login');

		render(<TestAuthRedirect to="/" ifFound />);

		await waitFor(() => {
			expect(mockRouter.asPath).toEqual('/');
		});
	});

	it('should redirect based on condition', async () => {
		server.use(
			http.get(MOCKED_URLS.SessionCurrent, () =>
				HttpResponse.json(
					{
						data: {
							id: 'current',
							type: 'sessions',
							attributes: {
								email: 'admin@infinum.com',
							},
						},
					},
					{ status: 200 }
				)
			)
		);

		await mockRouter.push('/login');

		render(<TestAuthRedirect to="/admin" condition={(session) => session?.email === 'admin@infinum.com'} />);

		await waitFor(() => {
			expect(mockRouter.asPath).toEqual('/admin');
		});
	});
});
