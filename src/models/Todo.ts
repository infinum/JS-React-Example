import { Attribute, Model } from 'datx';

export class Todo extends Model {
	public static type = 'todo';

	@Attribute({ isIdentifier: true })
	public uuid!: string;

	@Attribute()
	public title!: string;

	@Attribute()
	public done!: boolean;
}
