import { sequenceType } from '@/lib/datx-test-data-factory/src/generators/sequence';
import {
	BuildConfiguration,
	BuildTimeConfig,
	Field,
	FieldsConfiguration,
} from '@/lib/datx-test-data-factory/src/types';
import { isGenerator } from '@/lib/datx-test-data-factory/src/utils';
import { PureCollection, PureModel } from '@datx/core';

export const createFactory = <TCollection extends PureCollection>(client: TCollection) => {
	const factory = <TModel extends PureModel>(model: TModel, config?: BuildConfiguration<TModel>) => {
		let sequenceCounter = 0;

		const expandConfigField = (fieldValue: Field): Field => {
			if (isGenerator(fieldValue)) {
				switch (fieldValue.type) {
					case sequenceType: {
						return fieldValue.call(++sequenceCounter);
					}
				}
			}

			return fieldValue;
		};

		const expandConfigFields = (fields: FieldsConfiguration<TModel>, buildTimeConfig: BuildTimeConfig<TModel> = {}) => {
			// map through fields and expand generators
			const expandedFields = Object.entries(fields).reduce((acc, [key, value]) => {
				acc[key] = expandConfigField(value);

				return acc;
			}, {} as FieldsConfiguration<TModel>);

			return expandedFields;
		};

		const build = (buildTimeConfig: BuildTimeConfig<TModel> = {}) => {
			const fields = expandConfigFields(config.fields, buildTimeConfig);

			return client.add<TModel>(fields, model);
		};

		return build;
	};

	return factory;
};
