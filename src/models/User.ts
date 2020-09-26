import { Attribute, Model } from 'datx';
import { DemographicProfile } from './DemographicProfile';
import { NewsletterPreferences } from './NewsletterPreferences';
import { TodoList } from './TodoList';

export class User extends Model {
	public static type = 'user';

	@Attribute({ isIdentifier: true })
	public uuid!: string;

	@Attribute()
	public email!: string;

	@Attribute({ toOne: DemographicProfile })
	public demographicProfile!: DemographicProfile;

	@Attribute({ toOne: NewsletterPreferences })
	public newsletterPreferences!: NewsletterPreferences;

	@Attribute({ toMany: TodoList })
	public todoLists!: Array<TodoList>;
}
