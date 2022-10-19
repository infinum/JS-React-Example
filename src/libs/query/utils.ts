/**
 * Checks whether a value is a non-null object
 *
 * @export
 * @param {*} obj
 * @returns {boolean}
 */
export function isObject(obj: unknown): boolean {
	return obj !== null && typeof obj === 'object';
}

/**
 * Clones a value. If the value is an object, a deeply nested clone will be
 * created.
 *
 * Traverses all object properties (but not prototype properties).
 */
export function clone(obj: any): any {
	if (obj === undefined || obj === null || typeof obj !== 'object') {
		return obj;
	}

	let dup: any;
	let type = Object.prototype.toString.call(obj);

	if (type === '[object Date]') {
		dup = new Date();
		dup.setTime(obj.getTime());
	} else if (type === '[object RegExp]') {
		dup = obj.constructor(obj);
	} else if (type === '[object Array]') {
		dup = [];
		for (let i = 0, len = obj.length; i < len; i++) {
			if (obj.hasOwnProperty(i)) {
				dup.push(clone(obj[i]));
			}
		}
	} else {
		let val;

		dup = {};
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				val = obj[key];

				if (typeof val === 'object') {
					val = clone(val);
				}
				dup[key] = val;
			}
		}
	}

	return dup;
}

/**
 * Checks whether an object is null or undefined
 *
 * @export
 * @param {*} obj
 * @returns {boolean}
 */
export function isNone(obj: unknown): boolean {
	return obj === undefined || obj === null;
}

export type Dict<T> = Record<string, T>;

/**
 * Merges properties from other objects into a base object, traversing and
 * merging any objects that are encountered.
 *
 * Properties that resolve to `undefined` will not overwrite properties on the
 * base object that already exist.
 */
export function deepMerge(object: any, ...sources: any[]): any {
	sources.forEach((source) => {
		Object.keys(source).forEach((field) => {
			if (source.hasOwnProperty(field)) {
				let a = object[field];
				let b = source[field];

				if (isObject(a) && isObject(b) && !Array.isArray(a) && !Array.isArray(b)) {
					deepMerge(a, b);
				} else if (b !== undefined) {
					object[field] = clone(b);
				}
			}
		});
	});

	return object;
}
