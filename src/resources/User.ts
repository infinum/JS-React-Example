import { Attribute } from '@datx/core';
import { Resource } from '@datx/jsonapi-react';

export class User extends Resource {
	public static type = 'user';

	@Attribute({ isIdentifier: true })
	public id!: string | number;

	@Attribute()
	public firstName!: string;

	@Attribute()
	public lastName!: string;
}
