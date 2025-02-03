import { camelCase, isArray, isObject, map, mapKeys, mapValues, snakeCase } from 'lodash-es';

/**
 * Deep iteration trough an object and transformation
 *
 * @param obj - Object that needs to be Transformed
 * @param transformer - Transformer function
 * @return Transformed object
 */
export function iterator(obj: unknown, transformer: typeof snakeCase | typeof camelCase): unknown {
	if (isArray(obj)) {
		return map(obj, (value) => iterator(value, transformer));
	}

	if (isObject(obj)) {
		const copy = mapValues(obj, (value) => iterator(value, transformer));

		return mapKeys(copy, (_, key) => transformer(key));
	}

	return obj;
}

/**
 * Transform all object keys to snake_case
 *
 * @param obj - Object that needs to be sent tot he API
 * @return Transformed object
 */
export function apify(obj?: object) {
	return iterator(obj, snakeCase);
}

/**
 * Transform all object keys to camelCase
 *
 * @param obj - Object received from the API
 * @return Transformed object
 */
export function deapify(obj?: object) {
	return iterator(obj, camelCase);
}
