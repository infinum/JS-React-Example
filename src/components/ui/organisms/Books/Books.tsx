import { FC, useState } from 'react';
import useSWR from 'swr';
import { Response } from 'datx-jsonapi';

import { Book } from '@models/Book';

export const BOOKS_URL = 'books?filter[date_published][since]=1900-01-01&filter[date_published][until]=2020-01-01';

interface IBooksProps {
	initialData?: Response<Book>;
}

export const Books: FC<IBooksProps> = ({ initialData }) => {
	const [count, setCount] = useState(0);

	const { data: booksResponse, error } = useSWR<Response<Book>, Response<Book>>(BOOKS_URL, { initialData });

	if (error) {
		return (
			<div>
				<h2>Error:</h2> {JSON.stringify(error)}
			</div>
		);
	}

	if (!booksResponse) {
		return <div>Loading</div>;
	}

	return (
		<div>
			{(booksResponse?.data as Array<Book>).map((book, index) => (
				<div key={book.meta.id}>
					{index + 1}) {book.title}
				</div>
			))}

			<button onClick={() => setCount(count + 1)}>{count}</button>
		</div>
	);
};
