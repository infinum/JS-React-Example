export interface E2eApp {
	/** Project name in the root Playwright config, e.g. `frontend`. */
	name: string;
	/** E2E package directory, relative to the repo root. */
	dir: string;
	/** pnpm filter of the app under test. */
	filter: string;
	/** Port the app under test listens on. */
	port: number;
}

export declare const e2eApps: ReadonlyArray<E2eApp>;
export declare function getE2eApp(name: string): E2eApp;
