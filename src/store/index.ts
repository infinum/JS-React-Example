import { Client } from '@datx/jsonapi-react';

import { Todo } from '@/resources/Todo';
import { Session } from '@/resources/Session';
import { User } from '@/resources/User';
import { Flight } from '@/resources/Flight';
import { getModelType } from '@datx/core';

export class AppCollection extends Client {
	public static types = [Todo, Session, User, Flight];
}

export default new AppCollection();
