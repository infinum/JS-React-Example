import { Attribute } from '@datx/core';
import { Resource } from '@datx/jsonapi-react';

export class TodoResource extends Resource {
	static type = 'todos';

	public id!: string;
	public body!: string;
}

Attribute({ isIdentifier: true })(TodoResource, 'id');
Attribute()(TodoResource, 'body');
