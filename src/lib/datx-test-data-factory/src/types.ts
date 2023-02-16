import { PerBuildGenerator } from '@/lib/datx-test-data-factory/src/generators/per-build';
import { SequenceGenerator } from '@/lib/datx-test-data-factory/src/generators/sequence';
import { IModelConstructor, PureModel } from '@datx/core';

export type ModelType = IModelConstructor<PureModel>;

export type FieldGenerator<T> = SequenceGenerator<T> | PerBuildGenerator<T>;

export type Field<T = any> = T | FieldGenerator<T>;

/**
 * Removes all actions (functions) from a model
 */
export type OmitModelActions<TModel> = Omit<
	TModel,
	{
		[K in keyof TModel]: TModel[K] extends Function ? K : never;
	}[keyof TModel]
>;

/**
 * Removes meta data from a model
 */
export type OmitModelMeta<TModel> = Omit<TModel, 'meta'>;

/**
 * Extracts all attributes from a model
 */
export type Attributes<TModelType extends ModelType> = {
	[Key in keyof OmitModelMeta<OmitModelActions<InstanceType<TModelType>>>]?: InstanceType<TModelType>[Key];
};

export type FieldsConfiguration<TModelType extends ModelType> = {
	readonly [Key in keyof Attributes<TModelType>]: Field<Attributes<TModelType>[Key]>;
};

export type Overrides<TModelType extends ModelType> = {
	[Key in keyof Attributes<TModelType>]?: Field<Attributes<TModelType>[Key]>;
};

export interface Configuration<TModelType extends ModelType> {
	readonly fields: FieldsConfiguration<TModelType>;
	readonly postBuild?: (model: InstanceType<TModelType>) => InstanceType<TModelType>;
}

export interface BuildConfiguration<TModelType extends ModelType> {
	overrides?: Overrides<TModelType>;
	// map?: (builtThing: Attributes<TModelType>) => Attributes<TModelType>;
}

export interface Factory<TModelType extends ModelType> {
	(buildTimeConfig?: BuildConfiguration<TModelType>): InstanceType<TModelType>;
}
