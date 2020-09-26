import { Attribute, Model } from 'datx';
import { Todo } from './Todo';

export class TodoList extends Model {
	public static type = 'todo-list';

	@Attribute({ isIdentifier: true })
	public uuid!: string;

	@Attribute()
	public title!: string;

	@Attribute()
	public created!: string;

	@Attribute({ toMany: Todo })
	public todos!: Array<Todo>;
}
