import { QueryExpression } from './query-expression';
import { QueryTerm } from './query-term';

export type QueryBuilderFunc<QE extends QueryExpression, QB> = (
	QueryBuilder: QB
) => QE | QE[] | QueryTerm<QE> | QueryTerm<QE>[];
