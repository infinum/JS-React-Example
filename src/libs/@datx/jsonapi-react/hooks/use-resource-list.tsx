import { useMemo } from 'react';
import { getModelType } from '@datx/core';
import { prepareQuery, Response } from '@datx/jsonapi';
import useSWR from 'swr';

import { Meta, QueryConfig, ResourceListQueryCallback, ResourceListResponse } from '../types';
import { Resource } from '../Resource';
import { useDatx } from './use-datx';

export function useResourceList<TModel extends Resource = Resource, TMeta extends Meta = Meta>(
	queryCallback: ResourceListQueryCallback<TModel>,
	config?: QueryConfig<TModel>
) {
	const client = useDatx();

	const getKey = () => {
		const [type, options] = queryCallback();
		const modelType = getModelType(type);
		const query = prepareQuery(modelType, undefined, undefined, options);

		return query.url;
	};

	const fetcher = (url: string) => {
		const [, options] = queryCallback();

		return client.request<TModel>(url, 'GET', null, options);
	};

	const swr = useSWR<Response<TModel>, Response<TModel>>(getKey, fetcher, config);

	const handlers = useMemo(
		() => ({
			nextPage: () => swr.mutate((currentResponse) => currentResponse.next()),
			prevPage: () => swr.mutate((currentResponse) => currentResponse.prev()),
		}),
		// swr.mutate is always the same reference
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const state = {
		mutate: swr.mutate,
		...handlers,
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
		hasNext: {
			get: () => Boolean(swr.data?.links?.next),
			enumerable: true,
		},
		hasPrev: {
			get: () => Boolean(swr.data?.links?.prev),
			enumerable: true,
		},
	});

	return (state as unknown) as ResourceListResponse<TModel, TMeta>;
}
