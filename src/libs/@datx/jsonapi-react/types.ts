import { IModelConstructor, IType } from '@datx/core';
import { IJsonapiModel, IRequestOptions, Response } from '@datx/jsonapi';
import { SWRConfiguration } from 'swr';
import { Fetcher, SWRResponse } from 'swr/dist/types';

export type QueryResource<TModel> = [IType | IModelConstructor<TModel>, number | string, IRequestOptions?];
export type ResourceQueryCallback<TModel> = () => QueryResource<TModel> | null;

export type QueryResourceList<TModel> = [IType | IModelConstructor<TModel>, IRequestOptions?];
export type ResourceListQueryCallback<TModel> = () => QueryResourceList<TModel> | null;

export type Meta = Record<string, unknown>;

export type QueryConfig<TModel extends IJsonapiModel> = SWRConfiguration<
	Response<TModel>,
	Response<TModel>,
	Fetcher<Response<TModel>>
>;

export type Link =
	| string
	| {
			href: string;
			meta: Record<string, any>;
	  };

export type JsonApiError = {
	id?: string | number;
	links?: {
		about: Link;
	};
	status?: number;
	code?: string;
	title?: string;
	detail?: string;
	source?: {
		pointer?: string;
		parameter?: string;
	};
	meta?: Meta;
};

export type ResponseError = Array<JsonApiError> | Error | undefined;

export type ResourceResponse<TModel, TMeta, TError = ResponseError> = {
	data?: TModel;
	error: ResponseError;
	mutate: SWRResponse<TModel, TError>['mutate'];
	isValidating: boolean;
	meta: TMeta;
};

export type ResourceListResponse<TModel, TMeta, TError = ResponseError> = {
	data?: Array<TModel>;
	error: ResponseError;
	mutate: SWRResponse<TModel, TError>['mutate'];
	isValidating: boolean;
	meta: TMeta;
	next: () => Promise<TModel>;
	hasNext: boolean;
	prev: () => Promise<TModel>;
	hasPrev: boolean;
};
