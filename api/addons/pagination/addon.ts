/* eslint-disable no-import-assign */
import {
	Addon,
	Application,
	ApplicationInstance,
	HasId,
	KnexProcessor,
	Operation,
	OperationResponse,
	Resource,
} from 'kurier';
import { convertOperationResponseToHttpResponse } from 'kurier/src/utils/http-utils';
import Todo from '../../resources/todo';
import { PaginationOptions } from './types';

// monkey-patch
const old = convertOperationResponseToHttpResponse;
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
convertOperationResponseToHttpResponse = (req: any, operation: OperationResponse) => {
	const response = old(req, operation);

	console.log('asdasdasdasdasdasdas');

	return response;
};

const defaults: PaginationOptions = {
	defaultPaginator: 'paged',
	defaultPageSize: 10,
	maximumPageSize: 20,
};

export class PaginationAddon extends Addon {
	constructor(public readonly app: Application, public readonly options?: PaginationOptions) {
		super(app);
		this.options = { ...defaults, ...options };
	}

	async install(): Promise<void> {
		// console.log('test addon:', this.app);

		const processor = class PaginationProcessor<T extends Resource> extends KnexProcessor<T> {
			public static resourceClass = Todo;

			async get(op: Operation): Promise<HasId[] | HasId> {
				// console.log('test addon op:', op);

				const result = await super.get(op);

				// console.log(result);

				return result;
			}
		};

		this.app.processors.push(processor);

		const oldBuildOperationResponse = this.app.buildOperationResponse.bind(this.app);

		this.app.buildOperationResponse = async (
			data: Resource | Resource[] | void,
			appInstance: ApplicationInstance
		): Promise<OperationResponse> => {
			const operationResponse = await oldBuildOperationResponse(data, appInstance);

			let links = {};

			if (Array.isArray(data)) {
				links = {
					first: '',
					last: '',
					prev: '',
					next: '',
				};
			}

			console.log('operationResponse', {
				...operationResponse,
				links,
			});

			return {
				...operationResponse,
				links,
			};
		};
	}
}
