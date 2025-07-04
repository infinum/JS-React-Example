import 'next-runtime-env';
import { validateEnvironmentVariables } from './validate-env';

type Environment = ReturnType<typeof validateEnvironmentVariables>;

declare module 'next-runtime-env' {
	export function env<T extends keyof Environment>(key: T): Environment[T];
}
