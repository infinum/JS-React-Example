import { Collection } from 'datx';
import { computed } from 'mobx';
import { useMemo } from 'react';
import { DemographicProfile } from './models/DemographicProfile';
import { NewsletterPreferences } from './models/NewsletterPreferences';
import { Todo } from './models/Todo';
import { TodoList } from './models/TodoList';
import { User } from './models/User';
import { debug } from './utils/debugger';
import * as fetchers from './utils/fetchers';

debug('fetchers', fetchers);

export class AppData extends Collection {
	public static types = [DemographicProfile, NewsletterPreferences, Todo, TodoList, User];

	@computed
	public get user(): User | null {
		const users = this.findAll(User);
		return users.length ? users[0] : null;
	}
}

let store: AppData | undefined;

export function initializeStore(snapshot = null): AppData {
	const _store = store ?? new AppData(snapshot);

	// TODO: Any other way of doing this?
	Object.keys(fetchers).forEach((key) => {
		fetchers[key]._config.collection = _store;
	});

	// For SSG and SSR always create a new store
	if (typeof window === 'undefined') return _store;
	// Create the store once in the client
	if (!store) store = _store;

	debug('store', store);

	return store;
}

export function useStore(initialState?: object): AppData {
	const store = useMemo(() => initializeStore(initialState), [initialState]);
	return store;
}
