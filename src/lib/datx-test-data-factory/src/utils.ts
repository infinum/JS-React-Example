import { Field, FieldGenerator } from '@/lib/datx-test-data-factory/src/types';

export const isGenerator = (field: Field): field is FieldGenerator<any> => {
	if (!field) return false;

	return (field as FieldGenerator<any>).type !== undefined;
};
