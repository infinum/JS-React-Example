import { Attribute } from '@datx/core';
import { Resource } from '@datx/jsonapi-react';

export class Todo extends Resource {
	static type = 'todo';

	@Attribute()
	public body!: string;
}
