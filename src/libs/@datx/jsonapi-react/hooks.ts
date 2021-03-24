import { useContext } from 'react';

import { DatxContext } from './context';
// import { getModelType } from 'datx';
// import { prepareQuery, Response } from 'datx-jsonapi';
// import useSWR from 'swr';
// import isFunction from 'lodash/isFunction';
// import { useSWRCache } from './swr';

// // import { useStores } from '@hooks/useStores';
// import { Meta, QueryConfig, QueryResource, QueryResources, _QueryResourceFn, _QueryResourcesFn } from './types';
// import { Resource } from './Resource';
// import { isQueryOne, pickRequestOptions } from './utils';

export function useDatxClient() {
	const client = useContext(DatxContext);

	if (!client) {
		throw new Error('useDatxClient must be used inside DatxProvider.');
	}

	return client;
}

// export function useResource<TModel extends Resource = Resource, TMeta extends Meta = Meta>(
// 	queryResource: QueryResource<TModel>,
// 	config?: QueryConfig<TModel>
// ) {
// 	const client = useDatxClient();

// 	const getKey = () => {
// 		const [type, id, options] = isFunction(queryResource) ? queryResource() : queryResource;
// 		const modelType = getModelType(type);

// 		const query = prepareQuery(modelType, id, undefined, undefined);

// 		return query.url;
// 	};

// 	const fetcher = (url: string) => {
// 		// TODO: this is suboptimal because we are doing the same thing in getKey
// 		const [_, __, options] = isFunction(queryResource) ? queryResource() : queryResource;

// 		return client.request<TModel>(url, 'GET', null, options);
// 	};

// 	const swr = useSWR<Response<TModel>, Response<TModel>>(getKey, fetcher, config);

// 	// TODO: implement data select with getters

// 	return {
// 		...swr,
// 		data: swr.data?.data as TModel,
// 		error: swr.error?.error,
// 		meta: swr.data?.meta as TMeta,
// 	};
// }

// // eslint-disable-next-line @typescript-eslint/ban-types
// export function useResources<TModel extends Resource = Resource, TMeta extends Meta = Meta>(
// 	queryResources: QueryResources<TModel>,
// 	config?: QueryConfig<TModel>
// ) {
// 	const client = useDatxClient();

// 	const getKey = () => {
// 		const [type, options] = isFunction(queryResources) ? queryResources() : queryResources;
// 		const modelType = getModelType(type);

// 		const query = prepareQuery(modelType, undefined, undefined, options);

// 		return query.url;
// 	};

// 	const fetcher = (url: string) => {
// 		// TODO: this is suboptimal because we are doing the same thing in getKey
// 		const [_, options] = isFunction(queryResources) ? queryResources() : queryResources;

// 		const requestOptions = pickRequestOptions(options);

// 		return client.request<TModel>(url, 'GET', null, requestOptions);
// 	};

// 	const swr = useSWR<Response<TModel>, Response<TModel>>(getKey, fetcher, config);

// 	// TODO: implement data select with getters

// 	return {
// 		...swr,
// 		data: swr.data?.data as Array<TModel>,
// 		error: swr.error?.error,
// 		meta: swr.data?.meta as TMeta,
// 	};
// }

// export function useCache<TModel extends Resource = Resource, TMeta extends Meta = Meta>(
// 	queryResources: _QueryResourceFn<TModel> | _QueryResourcesFn<TModel>,
// 	config?: QueryConfig<TModel>
// ) {
// 	const client = useDatxClient();
// 	let query;

// 	if (queryResources) {
// 		const queryArray = queryResources();

// 		if (isQueryOne(queryArray)) {
// 			const [type, id, options] = queryArray;

// 			query = client.queryResource(type, id, options);
// 		} else {
// 			const [type, options] = queryArray;

// 			query = client.queryResources(type, options);
// 		}
// 	}

// 	const swr = useSWRCache<Response<TModel>, Response<TModel>>(query?.key, config);

// 	return {
// 		...swr,
// 		data: swr.data?.data as Array<TModel>,
// 		error: swr.error?.error,
// 		meta: swr.data?.meta as TMeta,
// 	};
// }
