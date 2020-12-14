import { createContext, useContext, useMemo } from 'react';
import { Response, IResponse } from 'datx-jsonapi';
import { dequal } from 'dequal/lite';

/**
 * SWR compare
 */
export const compare = (a: any, b: any): boolean => {
	if (a instanceof Response && b instanceof Response) {
		return dequal(a.snapshot.response.data, b.snapshot.response.data);
	}

	return dequal(a, b);
};

const Context = createContext(null);

export const DatxProvider = Context.Provider;

export function useStore() {
	const store = useContext(Context);

	if (!store) {
		throw new Error('useStore must be used within a store Provider.');
	}

	return store;
}

export function useServerSideResponse(data?: IResponse) {
	const store = useStore();

	const response = useMemo(() => {
		if (store && data) {
			return new Response({ data, status: 200 }, store);
		}
	}, [data, store]);

	return response;
}
