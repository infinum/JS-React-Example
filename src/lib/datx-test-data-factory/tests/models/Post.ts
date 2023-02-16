import { Comment } from '@/lib/datx-test-data-factory/tests/models/Comment';
import { Attribute, Model } from '@datx/core';

export class Post extends Model {
	public static type = 'posts';

	@Attribute({ isIdentifier: true })
	public id!: number;

	@Attribute()
	public body!: string;

	@Attribute({ toMany: 'comments' })
	public comments!: Array<Comment>;
}
