declare global {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Error {
		info?: any;
		status?: number;
	}
}

export const fetcher = async <TData>(input: RequestInfo, init?: RequestInit) => {
	const res = await fetch(input, { headers: { 'Content-Type': 'application/json' }, ...init });
	const contentType = res.headers.get('content-type');

	const isJSON = contentType?.indexOf('json') !== -1;
	const isText = contentType?.indexOf('text') !== -1;
	const isNoContent = res.status === 204;

	let data;

	if (!isNoContent) {
		if (isJSON) {
			data = await res.json();
		}

		if (isText) {
			data = await res.text();
		}
	}

	if (!res.ok) {
		const error = new Error(res.statusText);

		error['info'] = data;
		error['status'] = res.status;

		throw error;
	}

	if (data) {
		const totalCount = res.headers.get('x-total-count');
		data['totalCount'] = totalCount;
	}

	return data as TData;
};
