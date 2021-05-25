import { User } from '@/resources/User';
import { Attribute } from '@datx/core';
import { Resource } from '@datx/jsonapi-react';

export class Flight extends Resource {
	static type = 'flight';
	static endpoint = 'flights';

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

	@Attribute({ isIdentifier: true })
	public id!: string | number;
}
