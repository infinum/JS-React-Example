import Environment from 'jest-environment-jsdom';

class InfinumTestEnvironment extends Environment {
	constructor(...args: ConstructorParameters<typeof Environment>) {
		super(...args);

		// FIXME https://github.com/jsdom/jsdom/issues/3363
		this.global.structuredClone = structuredClone;

		// FIXME https://github.com/jsdom/jsdom/issues/1724
		this.global.fetch = fetch;
		this.global.Headers = Headers;
		this.global.Request = Request;
		this.global.Response = Response;
	}

	// public async setup() {
	// 	await super.setup();
	// 	if (typeof this.global.TextEncoder === 'undefined') {
	// 		const { TextEncoder, TextDecoder } = await require('util');
	// 		this.global.TextEncoder = TextEncoder;
	// 		this.global.TextDecoder = TextDecoder;
	// 	}
	// }
}

export default InfinumTestEnvironment;
