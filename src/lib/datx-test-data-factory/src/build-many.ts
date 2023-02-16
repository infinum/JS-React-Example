import { Factory, BuildConfiguration, ModelType } from '@/lib/datx-test-data-factory/src/types';

export const buildMany = <TModelType extends ModelType>(
	factory: Factory<TModelType>,
	count: number,
	buildTimeConfig?: BuildConfiguration<TModelType>
) => {
	return Array.from({ length: count }, () => factory(buildTimeConfig));
};
