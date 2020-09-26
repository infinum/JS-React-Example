import { Attribute, Model } from 'datx';

export class DemographicProfile extends Model {
	public static type = 'demographic-profile';

	@Attribute()
	public gender!: string;

	@Attribute()
	public age!: number;
}
