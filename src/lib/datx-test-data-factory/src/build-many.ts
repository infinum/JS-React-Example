import { Builder, BuildTimeConfig } from '@/lib/datx-test-data-factory/src/types';

export const buildMany = <TModel>(
	factory: Builder<TModel>,
	count: number,
	buildTimeConfig?: BuildTimeConfig<TModel>
) => {
	return Array.from({ length: count }, () => factory(buildTimeConfig));
};
