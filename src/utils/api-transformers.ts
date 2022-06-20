import camelCase from 'lodash/camelCase';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import mapKeys from 'lodash/mapKeys';
import mapValues from 'lodash/mapValues';
import snakeCase from 'lodash/snakeCase';

/**
 * Deep iteration trough an object and transformation
 *
 * @param obj - Object that needs to be Transformed
 * @param transformer - Transformer function
 * @return Transformed object
 */
export function iterator(
	obj: object | undefined,
	transformer: typeof snakeCase | typeof camelCase
): object | undefined {
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
