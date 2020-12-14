import { IRawCollection } from 'datx';

import { Datx } from '.';
import { isServer } from '../utils/env';

const __STORE__ = 'datx';

export function createDatx(initialState?: IRawCollection): Datx {
	// Always make a new store if on the server, otherwise the state is shared between requests
	if (isServer) {
		return new Datx(initialState);
	}

	// This will be true if the page constructor is called on the client
	if (!window[__STORE__]) {
		window[__STORE__] = new Datx(initialState);
	}

	return window[__STORE__];
}
