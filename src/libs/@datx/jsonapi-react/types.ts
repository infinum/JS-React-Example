import { IModelConstructor, IType } from '@datx/core';
import { IJsonapiModel, IRequestOptions, Response } from '@datx/jsonapi';
import { ConfigInterface, keyInterface } from 'swr';
import { Fetcher } from 'swr/dist/types';
import { Client } from './Client';
import { Resource } from './Resource';

export type QueryOperation = 'findRecord' | 'findRecords' | 'findRelatedRecord' | 'findRelatedRecords';
export type RecordIdentity = Resource | { type: string; id: string };

export interface IQueryExpression {
	op: QueryOperation;
}

export type QueryVariables = Record<string, any>;

export type QueryKeyFunction = (variables: QueryVariables) => keyInterface;

export interface IQueryHookOptions extends ConfigInterface {
	variables?: Record<string, any>;
	skip?: boolean;
	client?: Client;
}

export type QueryResource<TModel> = [IType | IModelConstructor<TModel>, number | string, IRequestOptions?];
export type QueryResourceFn<TModel> = () => QueryResource<TModel>;

export type QueryResourceList<TModel> = [IType | IModelConstructor<TModel>, IRequestOptions?];
export type QueryResourceListFn<TModel> = () => QueryResourceList<TModel>;

export type Meta = Record<string, unknown>;

export type QuerySelectFn<TModel> = (data: TModel) => any;

type QuerySelectConfig<TModel> = {
	select?: QuerySelectFn<TModel>;
};

export type QueryConfig<TModel extends IJsonapiModel> = ConfigInterface<
	Response<TModel>,
	Response<TModel>,
	Fetcher<Response<TModel>>
> &
	QuerySelectConfig<TModel>;
