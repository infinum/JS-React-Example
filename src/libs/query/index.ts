import { FindRecordsTerm } from '@/libs/query/record-query-term';
import { RecordQueryBuilder, RecordQueryBuilderFunc } from './record-query-builder';

export function query(recordQueryBuilderFunc: RecordQueryBuilderFunc) {
	const queryBuilder = recordQueryBuilderFunc(new RecordQueryBuilder());

	if (queryBuilder instanceof FindRecordsTerm) {
		return queryBuilder.toQueryExpression();
	}

	return queryBuilder;
}
