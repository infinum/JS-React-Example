import { config, ICollectionFetchOpts, IRawResponse, CachingStrategy } from '@datx/jsonapi';

import { Client, apify, deapify } from '@datx/jsonapi-react';
import { AuthorResource } from '../resources/AuthorResource';
import { BookResource } from '../resources/BookResource';

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

export class DatxClient extends Client {
	static types = [AuthorResource, BookResource];
}

export function createClient() {
	return new DatxClient();
}
