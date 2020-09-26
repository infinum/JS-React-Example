import { Attribute, Model } from 'datx';

export class NewsletterPreferences extends Model {
	public static type = 'newsletter-preferences';

	@Attribute({ isIdentifier: true })
	public uuid!: string;

	@Attribute()
	public weeklyNewsletter!: boolean;

	@Attribute()
	public specialOffers!: boolean;
}
