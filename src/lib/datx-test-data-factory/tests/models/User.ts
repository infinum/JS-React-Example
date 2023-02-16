import { Attribute, Model } from '@datx/core';

export class User extends Model {
	public static type = 'users';

	@Attribute({ isIdentifier: true })
	public id!: number;

	@Attribute()
	public name!: string;

	@Attribute()
	public email!: string;

	@Attribute()
	public role!: string;

	@Attribute()
	public avatar!: string;
}
