import { Collection } from 'datx';
import { jsonapi } from 'datx-jsonapi';

import { Book } from '../models/Book';
import { Author } from '../models/Author';

export class Datx extends jsonapi(Collection) {
	static types = [Book, Author];

	public fetcher = (url: string) => {
		return this.request(`${url}`, 'GET');
	};
}
