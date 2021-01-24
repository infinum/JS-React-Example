import { Attribute } from '@datx/core';
import { Resource } from '@datx/jsonapi-react';

export class AuthorResource extends Resource {
	static type = 'authors';

	readonly name: string;
	readonly birthplace: string;
	readonly dateOfBirth: string;
	readonly dateOfDeath: string;
}

Attribute()(AuthorResource, 'name');
Attribute()(AuthorResource, 'birthplace');
Attribute()(AuthorResource, 'dateOfBirth');
Attribute()(AuthorResource, 'dateOfDeath');
