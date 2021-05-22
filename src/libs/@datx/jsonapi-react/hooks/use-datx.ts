import { useContext } from 'react';

import { DatxContext } from '../context';

export function useDatx() {
	const client = useContext(DatxContext);

	if (!client) {
		throw new Error('useDatxClient must be used inside DatxProvider.');
	}

	return client;
}
