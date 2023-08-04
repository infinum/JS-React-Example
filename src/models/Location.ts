import { Flight } from '@/models/Flight';
import { Field, PureModel } from '@datx/core';
import { jsonapiModel } from '@datx/jsonapi';

export class Location extends jsonapiModel(PureModel) {
	public static readonly type = 'location';
	public static readonly endpoint = 'locations';

	@Field({ isIdentifier: true })
	public id!: string | number;

	@Field()
	public name!: string;

	@Field({ toMany: Flight, referenceProperty: 'location' })
	public flights!: Array<Flight>;
}
