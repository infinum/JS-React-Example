import { config, ICollectionFetchOpts, IRawResponse, CachingStrategy } from 'datx-jsonapi';
// import fetch from "isomorphic-unfetch";

import { apify, deapify } from '../utils/apify';

// config.fetchReference = globalThis.fetch;

config.cache = CachingStrategy.NetworkOnly;

config.baseUrl = '/api/';

// config.defaultFetchOptions = {
//   credentials: "include",
//   headers: {
//     Accept: "application/vnd.api+json",
//     "Content-Type": "application/vnd.api+json"
//   }
// };

config.transformResponse = (opts: IRawResponse) => {
	return { ...opts, data: deapify(opts.data) };
};

config.transformRequest = (opts: ICollectionFetchOpts) => {
	return { ...opts, data: apify(opts.data) };
};
