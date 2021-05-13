import { Resource } from 'kurier';

export default class Todo extends Resource {
	public static schema = {
		attributes: {
			title: String,
			body: String,
		},
		relationships: {},
	};
}
