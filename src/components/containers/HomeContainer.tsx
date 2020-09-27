import { ReactElement, useEffect } from 'react';

import { useStore } from 'store';
import { getTodoLists } from 'utils/fetchers';
import { Home } from '../ui/Home';

export function HomeContainer(): ReactElement {
	const store = useStore();

	useEffect(() => {
		getTodoLists.fetch().then((response) => {
			store.user.todoLists = response.data;
		});
	}, []);

	return <Home />;
}
