import { Client, JsonapiSwrClient } from '../src/datx/createClient';

declare module '@datx/swr' {
	interface IClient extends Client {
		types: Client['types'];
	}
}
