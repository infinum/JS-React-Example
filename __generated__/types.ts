// NOTE: this file is generated with datx generator

export type Flight = {
	type: 'flights';
	id?: string;
	lid?: string;
	attributes: {
		airplaneModel: string;
		departsAt: string;
		arrivesAt: string;
		basePrice: string;
		currentSeatPrice: string;
		name: string;
	};
};

export type Session = {
	type: 'sessions';
	id?: string;
	lid?: string;
	attributes: {
		email: string;
		password: string;
	};
	relationships: {
		user: {
			data: User;
		};
	};
};

export type User = {
	type: 'users';
	id?: string;
	lid?: string;
	attributes: {
		firstName: string;
		lastName: string;
	};
};
