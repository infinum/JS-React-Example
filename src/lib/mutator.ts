import { fetcher } from '@/lib/fetcher';

type MutatorMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Mutator<TFetcher extends Function> = TFetcher extends (
	input: infer TRequestInfo,
	init?: infer TRequestInit
) => infer TReturnValue
	? (input: TRequestInfo, init?: Omit<TRequestInit, 'method'> & { method: MutatorMethod }) => TReturnValue
	: never;

export const mutator: Mutator<typeof fetcher> = fetcher;
