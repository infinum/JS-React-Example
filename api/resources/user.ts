import { User as JsonApiUser, Password } from 'kurier';

export default class User extends JsonApiUser {
	static schema = {
		attributes: {
			username: String,
			emailAddress: String,
			passphrase: Password,
		},
		relationships: {},
	};
}
