import { ILoginFormValues } from '@/components/shared/auth/LoginForm/LoginForm';
import { JsonapiSwrClient } from '@/datx/create-client';
import { Session } from '@/models/Session';
import { SingleResponse } from '@datx/swr';

export interface ILoginData {
	type: 'sessions';
	attributes: ILoginFormValues;
}

interface ILoginDataObject {
	data: ILoginData;
}

export const login = (client: JsonapiSwrClient, data: ILoginDataObject) => {
	return client.request('sessions', 'POST', data, {
		queryParams: { include: 'user' },
	}) as unknown as Promise<SingleResponse<Session>>;
};

export const logout = (client: JsonapiSwrClient) =>
	client.request('sessions/me', 'DELETE') as unknown as Promise<SingleResponse<Session>>;
