import { Client } from '@datx/jsonapi-react';

import { Todo } from '@/models/Todo';
import { Message } from '@/models/Message';

class AppCollection extends Client {
	public static types = [Todo, Message];
}

export default new AppCollection();
