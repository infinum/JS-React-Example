import { getModelType } from '@datx/core';
import { prepareQuery, Response } from '@datx/jsonapi';
import useSWR from 'swr';

import { Meta, QueryConfig, ResourceQueryCallback, ResourceResponse } from '../types';
import { Resource } from '../Resource';
import { useDatx } from './use-datx';

export function useResource<TModel extends Resource = Resource, TMeta extends Meta = Meta>(
	queryCallback: ResourceQueryCallback<TModel> | null,
	config?: QueryConfig<TModel>
) {
	const client = useDatx();

	const getKey = () => {
		const [type, id, options] = queryCallback();
		const modelType = getModelType(type);
		const query = prepareQuery(modelType, id, undefined, options);

		return query.url;
	};

	const fetcher = (url: string) => {
		const [, , options] = queryCallback();

		return client.request<TModel>(url, 'GET', null, options);
	};

	const swr = useSWR<Response<TModel>, Response<TModel>>(getKey, fetcher, config);

	const state = {
		// TODO: figure out how to extend mutation to support create, update and delete actions
		mutate: swr.mutate,
	};

	// Use getter functions to avoid unnecessary re-renders caused by triggering all the getters of the returned swr object
	Object.defineProperties(state, {
		error: {
			get: () => swr.error?.error,
			enumerable: true,
		},
		data: {
			get: () => swr.data?.data as TModel,
			enumerable: true,
		},
		isValidating: {
			get: () => swr.isValidating,
			enumerable: true,
		},
		meta: {
			get: () => swr.data?.meta as TMeta,
			enumerable: true,
		},
	});

	return (state as unknown) as ResourceResponse<TModel, TMeta>;
}
