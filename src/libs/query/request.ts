import { Options } from './options';

export interface RequestOptions extends Options {
	fullResponse?: boolean;
	sources?: { [name: string]: RequestOptions };
}
