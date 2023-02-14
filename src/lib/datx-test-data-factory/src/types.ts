import { SequenceGenerator } from '@/lib/datx-test-data-factory/src/generators/sequence';
import { PureModel } from '@datx/core';

export type Field<T = any> = T | FieldsConfiguration<T>;

export type FieldGenerator<T> = SequenceGenerator<T>;

export type FieldsConfiguration<FactoryResultType> = {
	readonly [Key in keyof FactoryResultType]: Field<FactoryResultType[Key]>;
};

export type Overrides<FactoryResultType = any> = {
	[Key in keyof FactoryResultType]?: Field<FactoryResultType[Key]>;
};

export interface BuildTimeConfig<FactoryResultType> {
	overrides?: Overrides<FactoryResultType>;
	map?: (builtThing: FactoryResultType) => FactoryResultType;
}

export interface BuildConfiguration<TModel extends PureModel> {
	readonly fields: FieldsConfiguration<TModel>;
}

export interface Builder<FactoryResultType> {
	(buildTimeConfig?: BuildTimeConfig<FactoryResultType>): FactoryResultType;
}
