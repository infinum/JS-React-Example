import { buildJsonApiDocument } from '@/datx/buildJsonApiDocument';
import { TEST_INVALID_EMAIL, TEST_INVALID_PASSWORD } from '__mocks__/constants';
import { sessionFactory } from '__mocks__/factories';
import { HttpResponse, http } from 'msw';

export const generateTestApiUrl = (path: string) => {
	if (!process.env.API_TEST_ENDPOINT) {
		throw new Error('API_TEST_ENDPOINT is not defined');
	}

	return process.env.API_TEST_ENDPOINT + path;
};

export const MOCKED_URLS = {
	SessionCurrent: generateTestApiUrl('sessions/current'),
	SessionMe: generateTestApiUrl('sessions/me'),
	Session: generateTestApiUrl('sessions'),
	Flights: generateTestApiUrl('flights'),
} as const;

export const handlers = [
	http.get(MOCKED_URLS.SessionCurrent, () =>
		HttpResponse.json(
			{
				errors: [
					{
						status: 'unauthorized',
						code: 'UNAUTHORIZED',
						title: 'Unauthorized',
						detail: 'Must be logged in to perform this action',
					},
				],
			},
			{ status: 401 }
		)
	),
	http.delete(MOCKED_URLS.SessionMe, () => new Response(null, { status: 204 })),
];

export const handlerOverrides = {
	invalidEmailLogin: http.post(MOCKED_URLS.Session, () =>
		HttpResponse.json(
			{
				errors: [
					{
						status: 'unprocessable entity',
						code: 'UNPROCESSABLE_ENTITY',
						title: 'Unprocessable Entity',
						detail: TEST_INVALID_EMAIL,
						source: { parameter: 'email', pointer: 'data/attributes/email' },
					},
				],
			},
			{ status: 422 }
		)
	),
	invalidPasswordLogin: http.post(MOCKED_URLS.Session, () =>
		HttpResponse.json(
			{
				errors: [
					{
						status: 'unprocessable entity',
						code: 'UNPROCESSABLE_ENTITY',
						title: 'Unprocessable Entity',
						detail: TEST_INVALID_PASSWORD,
						source: { parameter: 'password', pointer: 'data/attributes/password' },
					},
				],
			},
			{ status: 422 }
		)
	),
	activeCurrentSession: http.get(MOCKED_URLS.SessionCurrent, () =>
		HttpResponse.json(buildJsonApiDocument(sessionFactory()), {
			status: 200,
		})
	),
};
