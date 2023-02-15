import { sequenceType } from '@/lib/datx-test-data-factory/src/generators/sequence';
import {
	Attributes,
	BuildConfiguration,
	Configuration,
	Field,
	FieldsConfiguration,
	ModelType,
} from '@/lib/datx-test-data-factory/src/types';
import { isGenerator } from '@/lib/datx-test-data-factory/src/utils';
import { PureCollection } from '@datx/core';

export const createFactory = <TCollection extends PureCollection>(client: TCollection) => {
	const factory = <TModelType extends ModelType>(model: TModelType, config?: Configuration<TModelType>) => {
		let sequenceCounter = 0;

		const computeField = (fieldValue: Field<Attributes<TModelType>>) => {
			if (isGenerator(fieldValue)) {
				switch (fieldValue.type) {
					case sequenceType: {
						return fieldValue.call(++sequenceCounter);
					}
				}
			}

			return fieldValue;
		};

		const compute = (fields: FieldsConfiguration<TModelType>, buildTimeConfig: BuildConfiguration<TModelType> = {}) => {
			const keys = Object.keys(fields);
			const expandedFields = keys.reduce((acc, key) => {
				acc[key] = computeField(fields[key]);

				return acc;
			}, {});

			return expandedFields;
		};

		const build = (buildTimeConfig: BuildConfiguration<TModelType> = {}) => {
			const fields = config?.fields ? compute(config?.fields, buildTimeConfig) : {};

			return client.add(fields, model) as InstanceType<TModelType>;
		};

		return build;
	};

	return factory;
};
