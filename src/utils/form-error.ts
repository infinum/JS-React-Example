import { SingleResponse, CollectionResponse } from '@datx/swr';
import camelCase from 'lodash/camelCase';

export type ResponseError = SingleResponse['error'] | CollectionResponse['error'];

export interface IApiError {
	name: string;
	type: string;
	message?: string;
}

export function getErrors(error: ResponseError): Array<IApiError> {
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

	return error?.map((error) => ({
		name: error.source?.parameter?.split('.').map(camelCase).join('.'),
		type: 'apiError',
		message: error.detail,
	}));
}
