import { Resource } from 'kurier';

export default class Message extends Resource {
	static schema = {
		attributes: {
			body: String,
		},
		relationships: {},
	};
}
