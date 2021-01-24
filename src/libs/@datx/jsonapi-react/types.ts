import { IModelConstructor, IType } from '@datx/core';
import { IRequestOptions } from '@datx/jsonapi';
import { ConfigInterface, keyInterface } from 'swr';
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

export type QueryResource<TModel> = [IType | IModelConstructor<TModel>, string, IRequestOptions?];

export type QueryResourceFn<TModel> = (variables: object) => QueryResource<TModel>;

export type QueryResources<TModel> = [IType | IModelConstructor<TModel>, IRequestOptions?];

export type QueryResourcesFn<TModel> = (variables: object) => QueryResources<TModel>;
