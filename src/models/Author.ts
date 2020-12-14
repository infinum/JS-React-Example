import { Model, Attribute } from 'datx';
import { jsonapi } from 'datx-jsonapi';

export class Author extends jsonapi(Model) {
	static type = 'authors';

	public name!: string;
	public birthplace!: string;
	public dateOfBirth!: string;
	public dateOfDeath!: string;
}

Attribute()(Author, 'name');
Attribute()(Author, 'birthplace');
Attribute()(Author, 'dateOfBirth');
Attribute()(Author, 'dateOfDeath');
