import { User } from '@/resources/User';
import { Attribute } from '@datx/core';
import { Resource } from '@datx/jsonapi-react';

export class Session extends Resource {
	static type = 'session';

	@Attribute({ isIdentifier: true })
	public id!: string | number;

	@Attribute()
	public email!: string;

	@Attribute()
	public password!: string;

	@Attribute({ toOne: User })
	public user!: User;
}
