import { Attribute } from '@datx/core';
import { Resource } from '@datx/jsonapi-react';

export class Message extends Resource {
	static type = 'message';

	@Attribute({ isIdentifier: true })
	public id!: string | number;

	@Attribute()
	public body!: string;
}
