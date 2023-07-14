import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { render, screen } from 'test-utils';
import { BasicPagination, getPagination } from './BasicPagination';
import { CollectionResponse } from '@datx/swr';

describe('BasicPagination', () => {
	const defaultPagination = {
		hasNext: false,
		hasPrevious: false,
		currentPage: 1,
		totalPages: 1,
	};

	it('should matches snapshot with falsy values', () => {
		const { asFragment } = render(<BasicPagination pagination={defaultPagination} />);

		expect(asFragment()).toMatchSnapshot('falsy values');
	});

	it('should matches snapshot with truthy values', () => {
		const { asFragment } = render(
			<BasicPagination
				pagination={{
					hasNext: true,
					hasPrevious: true,
					currentPage: 2,
					totalPages: 4,
				}}
			/>
		);

		expect(asFragment()).toMatchSnapshot('truthy values');
	});

	it('should be accessible', async () => {
		const { container } = render(<BasicPagination pagination={defaultPagination} />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});

	it('should set page query param on action', async () => {
		await mockRouter.push('/');
		const user = userEvent.setup();

		const { rerender } = render(
			<BasicPagination pagination={{ ...defaultPagination, hasNext: true, totalPages: 4 }} />,
			{ wrapper: MemoryRouterProvider }
		);

		const nextLink = screen.queryByRole('link', { name: /next/i });

		expect(nextLink).toBeInTheDocument();
		await user.click(nextLink as HTMLElement);

		expect(mockRouter).toMatchObject(
			expect.objectContaining({
				asPath: '/?page=2',
				pathname: '/',
				query: { page: '2' },
			})
		);

		rerender(
			<BasicPagination pagination={{ ...defaultPagination, hasPrevious: true, currentPage: 2, totalPages: 4 }} />
		);

		const prevLink = screen.queryByRole('link', { name: /prev/i });

		expect(prevLink).toBeInTheDocument();
		await user.click(prevLink as HTMLElement);

		expect(mockRouter).toMatchObject(
			expect.objectContaining({
				asPath: '/?page=1',
				pathname: '/',
				query: { page: '1' },
			})
		);
	});

	it('should keep other query params on action', async () => {
		await mockRouter.push('/?query=param');
		const user = userEvent.setup();

		render(<BasicPagination pagination={{ ...defaultPagination, hasNext: true, totalPages: 4 }} />, {
			wrapper: MemoryRouterProvider,
		});

		const nextLink = screen.queryByRole('link', { name: /next/i });

		expect(nextLink).toBeInTheDocument();

		await user.click(nextLink as HTMLElement);

		expect(mockRouter).toMatchObject(
			expect.objectContaining({
				asPath: '/?query=param&page=2',
				pathname: '/',
				query: { page: '2', query: 'param' },
			})
		);
	});
});

describe('getPagination', () => {
	it('should return empty object with no response', () => {
		expect(getPagination()).toEqual({});
	});

	it('should return pagination object from response', () => {
		expect(
			getPagination(
				new CollectionResponse({
					data: {
						meta: {
							currentPage: 1,
							totalPages: 1,
						},
					},
					status: 200,
				})
			)
		).toEqual({
			currentPage: 1,
			totalPages: 1,
			hasNext: false,
			hasPrevious: false,
		});
	});
});
