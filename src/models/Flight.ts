import { Company } from '@/models/Company';
import { Location } from '@/models/Location';
import { Field, PureModel } from '@datx/core';
import { jsonapiModel } from '@datx/jsonapi';

export class Flight extends jsonapiModel(PureModel) {
	public static readonly type = 'flight';
	public static readonly endpoint = 'flights';

	@Field({ isIdentifier: true })
	public id!: string | number;

	@Field()
	public airplaneModel!: string;

	@Field()
	public departsAt!: string;

	@Field()
	public arrivesAt!: string;

	@Field()
	public basePrice!: string;

	@Field()
	public currentSeatPrice!: string;

	@Field()
	public name!: string;

	@Field({ toOne: () => Company })
	public company!: Company;

	@Field({ toOne: () => Location })
	public location!: Location;
}
