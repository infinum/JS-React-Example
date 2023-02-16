import { perBuildType } from '@/lib/datx-test-data-factory/src/generators/per-build';
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
		let sequenceCounterMap = new Map();

		const computeField = (fieldValue: Field<Attributes<TModelType>>, key: string) => {
			if (isGenerator(fieldValue)) {
				switch (fieldValue.type) {
					case sequenceType: {
						if (!sequenceCounterMap.has(key)) {
							sequenceCounterMap.set(key, 0);
						}

						sequenceCounterMap.set(key, sequenceCounterMap.get(key) + 1);

						return fieldValue.call(sequenceCounterMap.get(key));
					}

					case perBuildType: {
						return fieldValue.call();
					}
				}
			}

			return fieldValue;
		};

		const compute = (fields: FieldsConfiguration<TModelType>, buildTimeConfig: BuildConfiguration<TModelType> = {}) => {
			const overrides = buildTimeConfig.overrides || {};

			return mapValues(fields, (value, key) => {
				const override = overrides[key];

				if (override) {
					return computeField(override, key);
				}

				return computeField(value, key);
			});
		};

		const build = (buildTimeConfig?: BuildConfiguration<TModelType>): InstanceType<TModelType> => {
			const fields = config?.fields ? compute(config?.fields, buildTimeConfig) : {};

			const data = client.add(fields, model) as InstanceType<TModelType>;

			if (config?.postBuild) {
				return config.postBuild(data);
			}

			return data;
		};

		return build;
	};

	return factory;
};
