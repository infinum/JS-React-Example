import { Attribute } from '@datx/core';
import { Resource } from '@datx/jsonapi-react';

export class User extends Resource {
	static type = 'user';

	@Attribute()
	public firstName!: string;

	@Attribute()
	public lastName!: string;

	@Attribute({ isIdentifier: true })
	public id!: string | number;
}
