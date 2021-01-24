import { Attribute } from '@datx/core';
import { Resource } from '@datx/jsonapi-react';

import { AuthorResource } from './AuthorResource';

export class BookResource extends Resource {
	static type = 'books';

	readonly title: string;
	readonly datePublished: string;
	readonly isbn: number;
	readonly author: AuthorResource;
}

Attribute()(BookResource, 'title');
Attribute()(BookResource, 'datePublished');
Attribute()(BookResource, 'isbn');
Attribute({ toOne: AuthorResource })(BookResource, 'author');
