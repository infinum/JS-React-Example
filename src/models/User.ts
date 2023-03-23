import { Attribute, Model } from '@datx/core';
import { jsonapi } from '@datx/jsonapi';

export class User extends jsonapi(Model) {
	public static readonly type = 'users';

	@Attribute({ isIdentifier: true })
	public id!: string | number;

	@Attribute()
	public firstName!: string;

	@Attribute()
	public lastName!: string;
}
