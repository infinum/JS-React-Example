import { Messages } from 'next-intl';

export const safeImportNamespace = async (locale: string, ns: string): Promise<Messages> => {
	try {
		const mod = (await import(`./locales/${locale}/${ns}.json`)) as { default: Messages };
		return mod.default;
	} catch (err: unknown) {
		const { code, message: msg } = (err ?? {}) as { code?: string; message?: string };

		if (
			code === 'MODULE_NOT_FOUND' || // Webpack/Node
			code === 'ERR_MODULE_NOT_FOUND' || // pure ESM Node
			/Cannot find module/i.test(msg ?? '') || // fallback
			/Unknown variable dynamic import/i.test(msg ?? '') // Vite/Vitest
		) {
			throw new Error(`Missing translation namespace "${ns}" in locale "${locale}".`, { cause: err });
		}

		// other errors (e.g. malformed JSON) – rethrow unchanged
		throw err;
	}
};
