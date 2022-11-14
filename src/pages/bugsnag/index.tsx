import Link from 'next/link';

const BugsnagPage = () => (
	<div style={{ maxWidth: 700, margin: '0 auto' }}>
		<h2>Bugsnag next.js Example</h2>
		<p>
			This example demonstrates how to record exceptions in your code with Bugsnag. There are several scenario pages
			below that result in various kinds of unhandled and handled exceptions.
		</p>
		<p>
			<strong>Important:</strong> exceptions in development mode take a different path than in production. These
			scenarios should be run on a production build (i.e. 'next build').{' '}
			<a href="https://nextjs.org/docs/advanced-features/custom-error-page#customizing-the-error-page">Read more</a>
		</p>
		<ol>
			<li>API route exceptions</li>
			<ol>
				<li>
					API has a top-of-module Promise that rejects, but its result is not awaited.{' '}
					<a href="/api/bugsnag/scenario1" target="_blank">
						Open in a new tab
					</a>
				</li>
				<li>
					API has a top-of-module exception.
					<a href="/api/bugsnag/scenario2" target="_blank">
						Open in a new tab
					</a>
				</li>
				<li>
					API has has an exception in its request handler.{' '}
					<a href="/api/bugsnag/scenario3" target="_blank">
						Open in a new tab
					</a>
				</li>
				<li>
					API uses a try/catch to handle an exception and records it.{' '}
					<a href="/api/bugsnag/scenario4" target="_blank">
						Open in a new tab
					</a>
				</li>
			</ol>
			<li>SSR exceptions</li>
			<ol>
				<li>
					getServerSideProps throws an Error.
					<a href="/bugsnag/ssr/scenario1" target="_blank">
						Open in a new tab
					</a>{' '}
					or{' '}
					<Link href="/bugsnag/ssr/scenario1">
						<a>Perform client side navigation</a>
					</Link>
				</li>
				<li>
					getServerSideProps returns a Promise that rejects.
					<a href="/bugsnag/ssr/scenario2" target="_blank">
						Open in a new tab
					</a>
				</li>
				<li>
					getServerSideProps calls a Promise that rejects, but does not handle the rejection or await its result
					(returning synchronously).
					<a href="/bugsnag/ssr/scenario3" target="_blank">
						Open in a new tab
					</a>
				</li>
				<li>
					getServerSideProps manually captures an exception from a try/catch.{' '}
					<a href="/bugsnag/ssr/scenario4" target="_blank">
						Open in a new tab
					</a>
				</li>
			</ol>
			<li>Client exceptions</li>
			<ol>
				<li>
					There is a top-of-module Promise that rejects, but its result is not awaited.{' '}
					<Link href="/bugsnag/client/scenario1">
						<a>Perform client side navigation</a>
					</Link>{' '}
					or{' '}
					<a href="/bugsnag/client/scenario1" target="_blank">
						Open in a new tab
					</a>
				</li>
				<li>
					There is a top-of-module exception. _error.js should render.{' '}
					<Link href="/bugsnag/client/scenario2">
						<a>Perform client side navigation</a>
					</Link>{' '}
					or{' '}
					<a href="/bugsnag/client/scenario2" target="_blank">
						Open in a new tab
					</a>
				</li>
				<li>
					There is an exception during React lifecycle that is caught by Next.js's React Error Boundary. In this case,
					when the component mounts. This should cause _error.js to render.{' '}
					<Link href="/bugsnag/client/scenario3">
						<a>Perform client side navigation</a>
					</Link>{' '}
					or{' '}
					<a href="/bugsnag/client/scenario3" target="_blank">
						Open in a new tab
					</a>
				</li>
				<li>
					There is an unhandled Promise rejection during React lifecycle. In this case, when the component mounts.{' '}
					<Link href="/bugsnag/client/scenario4">
						<a>Perform client side navigation</a>
					</Link>{' '}
					or{' '}
					<a href="/bugsnag/client/scenario4" target="_blank">
						Open in a new tab
					</a>
				</li>
				<li>
					An Error is thrown from an event handler.{' '}
					<Link href="/bugsnag/client/scenario5">
						<a>Perform client side navigation</a>
					</Link>{' '}
					or{' '}
					<a href="/bugsnag/client/scenario5" target="_blank">
						Open in a new tab
					</a>
				</li>
			</ol>
		</ol>
	</div>
);

export default BugsnagPage;
