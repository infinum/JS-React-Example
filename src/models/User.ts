import { Attribute, PureModel } from '@datx/core';
import { jsonapiModel } from '@datx/jsonapi';

export class User extends jsonapiModel(PureModel) {
	public static readonly type = 'user';

	@Attribute({ isIdentifier: true })
	public id!: string | number;

	@Attribute()
	public firstName!: string;

	@Attribute()
	public lastName!: string;
}
