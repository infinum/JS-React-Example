import { Model, Attribute } from 'datx';
import { jsonapi } from 'datx-jsonapi';

import { Author } from './Author';

export class Book extends jsonapi(Model) {
	static type = 'books';

	public title!: string;
	public datePublished!: string;
	public isbn!: number;
	public author!: Author;
}

Attribute()(Book, 'title');
Attribute()(Book, 'datePublished');
Attribute()(Book, 'isbn');
Attribute({ toOne: Author })(Book, 'author');
