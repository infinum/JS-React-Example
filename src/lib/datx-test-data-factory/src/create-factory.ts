import { sequenceType } from '@/lib/datx-test-data-factory/src/generators/sequence';
import {
	Attributes,
	BuildConfiguration,
	Configuration,
	Field,
	FieldsConfiguration,
	ModelType,
} from '@/lib/datx-test-data-factory/src/types';
import { isGenerator, mapValues } from '@/lib/datx-test-data-factory/src/utils';
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
			return mapValues(fields, (fieldValue, fieldKey) => {
				return computeField(fieldValue);
			});
		};

		const build = (buildTimeConfig: BuildConfiguration<TModelType> = {}) => {
			const fields = config?.fields ? compute(config?.fields, buildTimeConfig) : {};

			return client.add(fields, model) as InstanceType<TModelType>;
		};

		return build;
	};

	return factory;
};
