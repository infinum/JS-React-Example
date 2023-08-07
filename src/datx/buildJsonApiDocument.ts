import { JsonapiDocument, JsonapiResource } from '@/interfaces/Jsonapi';
import { IJsonapiModel, modelToJsonApi } from '@datx/jsonapi';
import uniqWith from 'lodash/uniqWith';

/**
 * This function is used to build a JSON:API document from a model or a collection of models.
 * It will also extract any relationships that are defined on the model in `included` property.
 *
 * @todo Add support for nested relationships?
 *
 * @param model The model or collection of models to build the document from
 * @returns The JSON:API document that can be used for API mocking
 */
export function buildJsonApiDocument<TModel extends IJsonapiModel>(model: TModel | Array<TModel>) {
	const isCollection = Array.isArray(model);

	const data: JsonapiResource<TModel> | Array<JsonapiResource<TModel>> = isCollection
		? model.map((m) => modelToJsonApi(m))
		: modelToJsonApi(model);

	const relationships = (
		Array.isArray(data)
			? data.flatMap((d) => Object.keys(d.relationships || {})).filter(Boolean)
			: Object.keys(data.relationships || {})
	) as Array<keyof TModel>;

	const included = relationships.flatMap((key) => {
		if (isCollection) {
			return model.flatMap((m) => {
				const relationshipModel = m[key] as IJsonapiModel | Array<IJsonapiModel>;

				return Array.isArray(relationshipModel)
					? relationshipModel.map((m) => modelToJsonApi(m))
					: modelToJsonApi(relationshipModel);
			});
		}

		const relationshipModel = model[key] as IJsonapiModel | Array<IJsonapiModel>;

		return Array.isArray(relationshipModel)
			? relationshipModel.map((m) => modelToJsonApi(m))
			: modelToJsonApi(relationshipModel);
	});

	return {
		data,
		...(included.length && { included: uniqWith(included, (a, b) => a.type === b.type && a.id === b.id) }),
	} satisfies JsonapiDocument<TModel>;
}
