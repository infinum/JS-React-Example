import { JsonapiSwrClient } from '@/datx/create-client';
import { Session } from '@/models/Session';
import { SingleResponse } from '@datx/swr';

export const login = (client: JsonapiSwrClient, data: object) =>
	client.request('sessions', 'POST', data, {
		queryParams: { include: 'user' },
	}) as unknown as Promise<SingleResponse<Session>>;

export const logout = (client: JsonapiSwrClient) =>
	client.request('sessions/me', 'DELETE') as unknown as Promise<SingleResponse<Session>>;
