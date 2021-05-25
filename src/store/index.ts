import { Client } from '@datx/jsonapi-react';

import { Session } from '@/resources/Session';
import { User } from '@/resources/User';
import { Flight } from '@/resources/Flight';

export class AppCollection extends Client {
	public static types = [Session, User, Flight];
}

export default new AppCollection();
