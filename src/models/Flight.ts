import { Attribute, PureModel } from '@datx/core';
import { jsonapiModel } from '@datx/jsonapi';

export class Flight extends jsonapiModel(PureModel) {
	public static readonly type = 'flights';

	@Attribute({ isIdentifier: true })
	public id!: string | number;

	@Attribute()
	public airplaneModel!: string;

	@Attribute()
	public departsAt!: string;

	@Attribute()
	public arrivesAt!: string;

	@Attribute()
	public basePrice!: string;

	@Attribute()
	public currentSeatPrice!: string;

	@Attribute()
	public name!: string;
}
