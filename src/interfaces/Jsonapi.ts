import { IModelConstructor, Model } from '@datx/core';
import { IJsonapiModel } from '@datx/jsonapi';

export type JsonapiResourceAttributes<TModel> = Partial<Omit<TModel, keyof IJsonapiModel | keyof Model>>;

/**
 * “Resource objects” appear in a JSON:API document to represent resources.
 *
 * @see https://jsonapi.org/format/#document-resource-objects
 */
export type JsonapiResource<TModelConstructor extends IModelConstructor> = {
	id?: string;
	lid?: string;
	type: TModelConstructor['type'];
	attributes: JsonapiResourceAttributes<InstanceType<TModelConstructor>>;
};

/**
 * The document’s “primary data” is a representation of the resource or collection of resources targeted by a request.
 * Primary data MUST be either:
 * - a single resource object, a single resource identifier object, or null, for requests that target single resources
 * - an array of resource objects, an array of resource identifier objects, or an empty array ([]), for requests that target resource collections
 *
 * @see https://jsonapi.org/format/#document-structure:~:text=The%20document%E2%80%99s%20%E2%80%9Cprimary%20data%E2%80%9D%20is%20a%20representation%20of%20the%20resource%20or%20collection%20of%20resources%20targeted%20by%20a%20request.
 */
export type JsonapiPrimaryData<TResourceConstructor extends IModelConstructor> =
	| JsonapiResource<TResourceConstructor>
	| Array<JsonapiResource<TResourceConstructor>>
	| null
	| [];

export type JsonapiDocument<TResourceConstructor extends IModelConstructor> = {
	data: JsonapiPrimaryData<TResourceConstructor>;
};
