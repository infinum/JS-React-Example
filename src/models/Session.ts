import { User } from '@/models/User';
import { Attribute, Model } from '@datx/core';
import { jsonapi, jsonapiModel } from '@datx/jsonapi';

export class Session extends jsonapi(Model) {
	public static readonly type = 'sessions';

	@Attribute({ isIdentifier: true })
	public id!: string | number;

	@Attribute()
	public email!: string;

	@Attribute()
	public password!: string;

	@Attribute({ toOne: User })
	public user!: User;
}
