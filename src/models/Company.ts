import { Flight } from '@/models/Flight';
import { Field, PureModel } from '@datx/core';
import { jsonapiModel } from '@datx/jsonapi';

export class Company extends jsonapiModel(PureModel) {
	public static readonly type = 'company';
	public static readonly endpoint = 'companies';

	@Field({ isIdentifier: true })
	public id!: string | number;

	@Field()
	public name!: string;

	@Field({ toMany: Flight, referenceProperty: 'company' })
	public flights!: Array<Flight>;
}
