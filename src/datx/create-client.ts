import { apify, deapify } from '@/utils/api-transformers';
import { Collection } from '@datx/core';
import { CachingStrategy, config, ICollectionFetchOpts, IRawResponse } from '@datx/jsonapi';
import nodeFetch from 'node-fetch';
import { jsonapiSwrClient } from '@datx/swr';

import { Flight } from '../models/Flight';
import { Session } from '../models/Session';
import { User } from '../models/User';
import { Company } from '../models/Company';
import { Location } from '../models/Location';

export class JsonapiSwrClient extends jsonapiSwrClient(Collection) {
	public static types = [Session, User, Flight, Company, Location];
}

export function createClient() {
	config.baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT as string;

	if (process.env.NODE_ENV === 'test') {
		// @ts-expect-error MSW cannot intercept requests when using Node 18 Fetch API
		config.fetchReference = nodeFetch;
		config.baseUrl = process.env.API_TEST_ENDPOINT as string;
	}

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
