import { Collection, getModelType, IModelConstructor, IType } from '@datx/core';
import { IRequestOptions, jsonapi, prepareQuery } from '@datx/jsonapi';
import { Resource } from './Resource';

export class Client extends jsonapi(Collection) {
	/**
	 *
	 * @param {string} type Record type
	 * @param {number|string} type Record id
	 * @param {IRequestOptions} [options] Server options
	 */
	public queryResource<TModel extends Resource = Resource>(
		type: IType | IModelConstructor<TModel>,
		id: string,
		options?: IRequestOptions
	) {
		const modelType = getModelType(type);
		const query = prepareQuery(modelType, id, undefined, options);

		const fetcher = () => this.getOne<TModel>(type, id, options);

		return {
			key: query.url,
			fetcher,
		};
	}

	/**
	 * @param {string} type Record type
	 * @param {IRequestOptions} [options] Server options
	 */
	public queryResources<TModel extends Resource = Resource>(
		type: IType | IModelConstructor<TModel>,
		options?: IRequestOptions
	) {
		const modelType = getModelType(type);
		const query = prepareQuery(modelType, undefined, undefined, options);

		const fetcher = () => this.getMany(type, options);

		return {
			key: query.url,
			fetcher,
		};
	}
}
