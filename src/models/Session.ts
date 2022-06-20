import { User } from '@/models/User';
import { Attribute, PureModel } from '@datx/core';
import { jsonapiModel } from '@datx/jsonapi';

export class Session extends jsonapiModel(PureModel) {
	public static readonly type = 'session';

	@Attribute({ isIdentifier: true })
	public id!: string | number;

	@Attribute()
	public email!: string;

	@Attribute()
	public password!: string;

	@Attribute({ toOne: User })
	public user!: User;
}
