import { Messages } from 'next-intl';

export const safeImportNamespace = async (locale: string, ns: string): Promise<Messages> => {
	try {
		const mod = await import(`./locales/${locale}/${ns}.json`);
		return mod.default;
	} catch (err: any) {
		const code = err?.code as string | undefined;
		const msg = err?.message as string | undefined;

		if (
			code === 'MODULE_NOT_FOUND' || // Webpack/Node
			code === 'ERR_MODULE_NOT_FOUND' || // pure ESM Node
			/Cannot find module/i.test(msg ?? '') // fallback
		) {
			throw new Error(`Missing translation namespace "${ns}" in locale "${locale}".`);
		}

		// other errors (e.g. malformed JSON) – rethrow unchanged
		throw err;
	}
};
