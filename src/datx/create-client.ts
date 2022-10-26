import { Collection } from '@datx/core';
import { CachingStrategy, config, ICollectionFetchOpts, IRawResponse } from '@datx/jsonapi';
import { jsonapiSwrClient } from '@datx/swr';

import { Session } from '../models/Session';
import { User } from '../models/User';
import { apify, deapify } from '@/utils/api-transformers';

export class JsonapiSwrClient extends jsonapiSwrClient(Collection) {
	public static types = [Session, User];
}

export function createClient() {
	config.baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT as string;
	config.cache = CachingStrategy.NetworkOnly;
	config.defaultFetchOptions = {
		headers: {
			Accept: 'application/vnd.api+json',
			'Content-Type': 'application/vnd.api+json',
		},
		credentials: 'include',
	};

	config.transformResponse = (opts: IRawResponse) => {
		return { ...opts, data: deapify(opts.data) };
	};

	config.transformRequest = (opts: ICollectionFetchOpts) => {
		return { ...opts, data: apify(opts.data) };
	};

	const client = new JsonapiSwrClient();

	return client;
}

export type Client = typeof JsonapiSwrClient;
