import { FC, useState } from 'react';
import { Response } from '@datx/jsonapi';
import { BookResource } from '@/resources/BookResource';
import { Button, Skeleton } from '@chakra-ui/react';
import { useResources, QueryResources } from '@datx/jsonapi-react';

export const BOOKS_QUERY: QueryResources<BookResource> = [
	BookResource,
	{
		queryParams: {
			custom: [
				{
					key: 'filter[date_published][since]',
					value: '1900-01-01',
				},
				{
					key: 'filter[date_published][until]',
					value: '2020-01-01',
				},
			],
		},
	},
];

interface IBooksProps {
	initialData?: Response<BookResource>;
}

export const Books: FC<IBooksProps> = ({ initialData }) => {
	const [count, setCount] = useState(0);

	const { data } = useResources(BOOKS_QUERY, {
		initialData,
		suspense: true,
	});

	return (
		<div>
			{data?.map((book, index) => (
				<div key={book.meta.id}>
					{index + 1}) {book.title}
				</div>
			))}

			<Button onClick={() => setCount(count + 1)}>{count}</Button>
		</div>
	);
};

export const BooksSkeleton: FC = () => {
	return <Skeleton />;
};
