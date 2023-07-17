/* eslint-disable @typescript-eslint/naming-convention */
import { IModelConstructor, Model } from '@datx/core';
import { IJsonapiModel } from '@datx/jsonapi';

type LeastOneOf<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export interface JsonapiLinkObject {
	/**
	 * a string whose value is a URI-reference [RFC3986 Section 4.1] pointing to the link’s target.
	 *
	 * @see https://www.rfc-editor.org/rfc/rfc3986#section-4.1
	 */
	href: string;
	/**
	 * a string indicating the link’s relation type. The string MUST be a valid link relation type.
	 *
	 * @see https://www.rfc-editor.org/rfc/rfc8288#section-2.1
	 */
	rel?: string;
	/**
	 * a link to a description document (e.g. OpenAPI or JSON Schema) for the link target.
	 *
	 * @see https://jsonapi.org/format/#document-links-link
	 */
	describedBy?: string;
	/**
	 * a string which serves as a label for the destination of a link such that it can be used as a
	 * human-readable identifier (e.g., a menu entry).
	 */
	title?: string;
	/**
	 * a string indicating the media type of the link’s target.
	 */
	type?: string;
	/**
	 * a string or an array of strings indicating the language(s) of the link’s target. An array of
	 * strings indicates that the link’s target is available in multiple languages. Each string MUST
	 * be a valid language tag [RFC5646].
	 *
	 * @see https://tools.ietf.org/html/rfc5646
	 */
	hreflang?: string;
	/**
	 * a meta object containing non-standard meta-information about the link.
	 */
	meta?: object;
}

/**
 * Where specified, a links member can be used to represent links. The value of this member MUST be an object (a “links object”).
 *
 * Within this object, a link MUST be represented as either:
 * - a string whose value is a URI-reference [RFC3986 Section 4.1] pointing to the link’s target,
 * - a link object or
 * - null if the link does not exist.
 *
 * @see https://jsonapi.org/format/#document-links
 */
export interface JsonapiLinks {
	self?: string | JsonapiLinkObject | null;
	related?: string | JsonapiLinkObject | null;
}

export interface JsonapiPaginationLinks {
	first?: string | JsonapiLinkObject | null;
	last?: string | JsonapiLinkObject | null;
	prev?: string | JsonapiLinkObject | null;
	next?: string | JsonapiLinkObject | null;
}

/**
 * @see https://jsonapi.org/format/#document-top-level
 */
export type JsonapiTopLevelLinks = JsonapiLinks &
	JsonapiPaginationLinks & {
		/**
		 * a link to a description document (e.g. OpenAPI or JSON Schema) for the current document.
		 */
		describedby?: string | JsonapiLinkObject | null;
	};

/**
 * Where specified, a meta member can be used to include non-standard meta-information.
 * The value of each meta member MUST be an object (a “meta object”).
 *
 * Any members MAY be specified within meta objects.
 * @see https://jsonapi.org/format/#document-meta
 */
export type JsonapiMeta = Record<string, unknown>;

/**
 * A “resource identifier object” is an object that identifies an individual resource.
 *
 * @see https://jsonapi.org/format/#document-resource-identifier-objects
 */
export type JsonapiResourceIdentifier<TModelConstructor extends IModelConstructor> = (
	| {
			id: string;
			lid: never;
	  }
	| {
			id: never;
			lid: string;
	  }
) & {
	type: TModelConstructor['type'];
	meta?: JsonapiMeta;
};

/**
 * Resource linkage in a compound document allows a client to link together all
 * of the included resource objects without having to GET any URLs via links.
 *
 * Resource linkage MUST be represented as one of the following:
 * - null for empty to-one relationships.
 * - an empty array ([]) for empty to-many relationships.
 * - a single resource identifier object for non-empty to-one relationships.
 * - an array of resource identifier objects for non-empty to-many relationships.
 *
 * @see https://jsonapi.org/format/#document-resource-object-linkage
 */
export type JsonapiResourceLinkage<TModelConstructor extends IModelConstructor> =
	| null
	| []
	| JsonapiResourceIdentifier<TModelConstructor>
	| Array<JsonapiResourceIdentifier<TModelConstructor>>;

/**
 * The value of the attributes key MUST be an object (an “attributes object”).
 * Members of the attributes object (“attributes”) represent information about
 * the resource object in which it’s defined.
 *
 * @see https://jsonapi.org/format/#document-resource-object-attributes
 */
export type JsonapiResourceAttributes<TModel> = Partial<
	Omit<
		{
			[Key in keyof TModel as TModel[Key] extends IJsonapiModel | Array<IJsonapiModel> ? never : Key]-?: TModel[Key];
		},
		keyof IJsonapiModel | keyof Model
	>
>;

/**
 * The value of the relationships key MUST be an object (a “relationships object”).
 * Each member of a relationships object represents a “relationship” from the
 * resource object in which it has been defined to other resource objects.
 *
 * Relationships may be to-one or to-many.
 *
 * @see https://jsonapi.org/format/#document-resource-object-relationships
 */
export type JsonapiResourceRelationships<TModel> = Partial<
	Omit<
		{
			[Key in keyof TModel as TModel[Key] extends IJsonapiModel | Array<IJsonapiModel> ? Key : never]-?: LeastOneOf<{
				links: JsonapiLinks;
				// TODO: figure out support for relationship links and how to get instance type for JsonapiResourceLinkage
				data: Record<string, unknown> | Array<Record<string, unknown>>;
				meta: JsonapiMeta;
			}>;
		},
		keyof IJsonapiModel | keyof Model
	>
>;

/**
 * “Resource objects” appear in a JSON:API document to represent resources.
 *
 * @see https://jsonapi.org/format/#document-resource-objects
 */
export interface JsonapiResource<TModelConstructor extends IModelConstructor> {
	id?: string;
	lid?: string;
	type: TModelConstructor['type'];
	attributes: JsonapiResourceAttributes<InstanceType<TModelConstructor>>;
	relationships?: JsonapiResourceRelationships<InstanceType<TModelConstructor>>;
}

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

export interface JsonapiDocument<TResourceConstructor extends IModelConstructor> {
	data: JsonapiPrimaryData<TResourceConstructor>;
	links?: JsonapiTopLevelLinks;
}
