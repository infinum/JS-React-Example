import { JsonapiSwrClient } from '@/datx/create-client';
import { Session } from '@/models/Session';

export const login = (client: JsonapiSwrClient, data: any) =>
	client.request<Session, Session>('sessions', 'POST', data, { queryParams: { include: 'user' } });

export const logout = (client: JsonapiSwrClient) => client.request('sessions/me', 'DELETE');
