import { config, CachingStrategy, IRawResponse, ICollectionFetchOpts } from '@datx/jsonapi';
import { apify, deapify } from '@datx/jsonapi-react';

config.cache = CachingStrategy.NetworkOnly;

config.baseUrl = 'http://localhost:3000/api/v1/';

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
