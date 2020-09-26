export function debug(prop: string, value: object): void {
	if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
		window['dev'] = window['dev'] || {};
		window['dev'][prop] = value;
	}
}
