import { Client, JsonapiSwrClient } from '../src/datx/create-client';

declare module '@datx/swr' {
	interface IClient extends Client {
		types: Client['types'];
	}
}
