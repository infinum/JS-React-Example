import { useContext } from 'react';
import { getModelType } from '@datx/core';
import { prepareQuery, Response } from '@datx/jsonapi';
import isFunction from 'lodash/isFunction';
import useSWR from 'swr';

import { Meta, QueryConfig, QueryResourceFn, QueryResourceListFn } from './types';
import { Resource } from './Resource';
import { DatxContext } from './context';

export function useDatxClient() {
	const client = useContext(DatxContext);

	if (!client) {
		throw new Error('useDatxClient must be used inside DatxProvider.');
	}

	return client;
}

export function useResource<TModel extends Resource = Resource, TMeta extends Meta = Meta>(
	queryResource: QueryResourceFn<TModel> | null,
	config?: QueryConfig<TModel>
) {
	const client = useDatxClient();

	const getKey = () => {
		const [type, id, options] = queryResource();

		const modelType = getModelType(type);

		const query = prepareQuery(modelType, id, undefined, options);

		return query.url;
	};

	const fetcher = (url: string) => {
		const [_, __, options] = queryResource();

		return client.request<TModel>(url, 'GET', null, options);
	};

	const swr = useSWR<Response<TModel>, Response<TModel>>(getKey, fetcher, config);

	// TODO: implement data select with getters
	return {
		...swr,
		data: swr.data?.data as TModel,
		error: swr.error?.error,
		meta: swr.data?.meta as TMeta,
	};
}

export function useResourceList<TModel extends Resource = Resource, TMeta extends Meta = Meta>(
	queryResources: QueryResourceListFn<TModel> | null,
	config?: QueryConfig<TModel>
) {
	const client = useDatxClient();

	const getKey = () => {
		const [type, options] = isFunction(queryResources) ? queryResources() : queryResources;
		const modelType = getModelType(type);

		const query = prepareQuery(modelType, undefined, undefined, options);

		return query.url;
	};

	const fetcher = (url: string) => {
		// TODO: this is suboptimal because we are doing the same thing in getKey
		const [_, options] = isFunction(queryResources) ? queryResources() : queryResources;

		return client.request<TModel>(url, 'GET', null, options);
	};

	const swr = useSWR<Response<TModel>, Response<TModel>>(getKey, fetcher, config);

	// TODO: implement data select with getters
	return {
		...swr,
		data: swr.data?.data as Array<TModel>,
		error: swr.error?.error,
		meta: swr.data?.meta as TMeta,
	};
}
