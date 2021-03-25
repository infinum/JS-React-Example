import { Client } from '@datx/jsonapi-react';

import { Todo } from '@/models/Todo';

class AppCollection extends Client {
	public static types = [Todo];
}

export default new AppCollection();
