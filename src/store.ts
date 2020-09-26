import { Collection } from 'datx';
import { useMemo } from 'react';
import { DemographicProfile } from './models/DemographicProfile';
import { NewsletterPreferences } from './models/NewsletterPreferences';
import { Todo } from './models/Todo';
import { TodoList } from './models/TodoList';
import { User } from './models/User';
import { debug } from './utils/debugger';

export class AppData extends Collection {
	public static types = [DemographicProfile, NewsletterPreferences, Todo, TodoList, User];
}

let store: AppData | undefined;

export function initializeStore(snapshot = null): AppData {
	const _store = store ?? new AppData(snapshot);

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
