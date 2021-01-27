import { errorKeyIndicator, isValidatingKeyIndicator } from './constants';

export function isDataKey(key: string) {
	return !(key.startsWith(errorKeyIndicator) || key.startsWith(isValidatingKeyIndicator));
}
