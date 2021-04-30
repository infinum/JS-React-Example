import { Client } from '@datx/jsonapi-react';

import { Todo } from '@/resources/Todo';
import { Message } from '@/resources/Message';

class AppCollection extends Client {
	public static types = [Todo, Message];
}

export default new AppCollection();
