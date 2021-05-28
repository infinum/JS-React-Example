import camelCase from 'lodash/camelCase';

interface IApiError {
	name: any;
	type: string;
	message: string;
}

export function setApiErrors(response: any): Array<IApiError> {
	return response?.map((error: any) => ({
		name: error.source?.parameter.split('.').map(camelCase).join('.'),
		type: 'apiError',
		message: error.detail,
	}));
}
