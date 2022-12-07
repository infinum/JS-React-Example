import { Response } from '@datx/jsonapi';
import { IError } from '@datx/jsonapi/dist/interfaces/JsonApi';
import camelCase from 'lodash/camelCase';

interface IApiError {
	name: any;
	type: string;
	message?: string;
}

export function getErrors(error: Response['error']): Array<IApiError> {
	if (error === undefined) {
		return [
			{
				name: 'error',
				type: 'error',
			},
		];
	}

	if (error instanceof Error) {
		return [
			{
				name: error.name,
				type: 'error',
				message: error.message,
			},
		];
	}

	return error?.map((error: any) => ({
		name: error.source?.parameter.split('.').map(camelCase).join('.'),
		type: 'apiError',
		message: error.detail,
	}));
}
