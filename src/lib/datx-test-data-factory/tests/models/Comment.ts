import { Post } from '@/lib/datx-test-data-factory/tests/models/Post';
import { User } from '@/lib/datx-test-data-factory/tests/models/User';
import { Attribute, Model } from '@datx/core';

export class Comment extends Model {
	public static type = 'comments';

	@Attribute({ isIdentifier: true })
	public id!: string;

	@Attribute()
	public body!: string;

	@Attribute({ toOne: User.type })
	public author!: User;

	@Attribute({ toOne: Post.type })
	public post!: Post;
}
