/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Response, IResponse } from '@datx/jsonapi';
import { useContext, useMemo } from 'react';
import useSWR, { ConfigInterface } from 'swr';
import { fetcherFn } from 'swr/dist/types';

import { DatxContext } from './context';
import { Resource } from './Resource';
import { QueryKeyFunction, IQueryHookOptions, QueryResource, QueryResources } from './types';

export function useDatxClient() {
	const client = useContext(DatxContext);

	if (!client) {
		throw new Error('useDatxClient must be used inside DatxProvider.');
	}

	return client;
}

export function useQuery(queryKeyFunction: QueryKeyFunction, options: IQueryHookOptions) {
	const { variables, skip, client, ...rest } = options;

	if (skip) {
		throw 'skip is not implemented!';
	}

	if (client) {
		throw `client override is not implemented!`;
	}

	const swr = useSWR(queryKeyFunction(variables), rest);

	return swr;
}

export function useResource<TModel extends Resource = Resource, TMeta extends object = object>(
	queryResource: QueryResource<TModel>,
	config?: ConfigInterface<Response<TModel>, Response<TModel>, fetcherFn<Response<TModel>>>
) {
	const client = useDatxClient();
	let query;

	if (queryResource) {
		const [type, id, options] = queryResource;

		query = client.queryResource(type, id, options);
	}

	const swr = useSWR<Response<TModel>, Response<TModel>>(query?.key, query?.fetcher, config);

	return {
		...swr,
		data: swr.data?.data as TModel,
		error: swr.error?.error,
		meta: swr.data?.meta as TMeta,
	};
}

export function useResources<TModel extends Resource = Resource, TMeta extends object = object>(
	queryResources: QueryResources<TModel>,
	config?: ConfigInterface<Response<TModel>, Response<TModel>, fetcherFn<Response<TModel>>>
) {
	const client = useDatxClient();
	let query;

	if (queryResources) {
		const [type, options] = queryResources;

		query = client.queryResources(type, options);
	}

	const swr = useSWR<Response<TModel>, Response<TModel>>(query?.key, query?.fetcher, config);

	return {
		...swr,
		data: swr.data?.data as Array<TModel>,
		error: swr.error?.error,
		meta: swr.data?.meta as TMeta,
	};
}

export function useServerSideResponse(data?: IResponse) {
	const client = useDatxClient();

	const response = useMemo(() => {
		if (client && data) {
			return new Response({ data, status: 200 }, client);
		}
	}, [data, client]);

	return response;
}
