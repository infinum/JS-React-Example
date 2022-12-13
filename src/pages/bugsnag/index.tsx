import { Box, Heading, Text, Link, List, ListItem, OrderedList } from '@chakra-ui/react';
import NextLink from 'next/link';

const BugsnagPage = () => (
	<Box maxW="700" m="0 auto">
		<Heading>Bugsnag next.js Example</Heading>
		<Text mt="2">
			This example demonstrates how to record exceptions in your code with Bugsnag. There are several scenario pages
			below that result in various kinds of unhandled and handled exceptions.
		</Text>
		<Text mt="2">
			<strong>Important:</strong> exceptions in development mode take a different path than in production. These
			scenarios should be run on a production build (i.e. 'next build').{' '}
			<Link href="https://nextjs.org/docs/advanced-features/custom-error-page#customizing-the-error-page">
				Read more
			</Link>
		</Text>

		<OrderedList mt="3" spacing="2">
			<ListItem>API route exceptions</ListItem>
			<OrderedList>
				<ListItem>
					API has a top-of-module Promise that rejects, but its result is not awaited.{' '}
					<Link color="red.500" href="/api/bugsnag/scenario1" target="_blank">
						Open in a new tab
					</Link>
				</ListItem>
				<ListItem>
					API has a top-of-module exception.
					<Link color="red.500" href="/api/bugsnag/scenario2" target="_blank">
						Open in a new tab
					</Link>
				</ListItem>
				<ListItem>
					API has has an exception in its request handler.{' '}
					<Link color="red.500" href="/api/bugsnag/scenario3" target="_blank">
						Open in a new tab
					</Link>
				</ListItem>
				<ListItem>
					API uses a try/catch to handle an exception and records it.{' '}
					<Link color="red.500" href="/api/bugsnag/scenario4" target="_blank">
						Open in a new tab
					</Link>
				</ListItem>
			</OrderedList>

			<ListItem>SSR exceptions</ListItem>
			<OrderedList>
				<ListItem>
					getServerSideProps throws an Error.
					<Link color="red.500" href="/bugsnag/ssr/scenario1" target="_blank">
						Open in a new tab
					</Link>{' '}
					or{' '}
					<Link as={NextLink} color="red.500" href="/bugsnag/ssr/scenario1">
						Perform client side navigation
					</Link>
				</ListItem>
				<ListItem>
					getServerSideProps returns a Promise that rejects.
					<Link color="red.500" href="/bugsnag/ssr/scenario2" target="_blank">
						Open in a new tab
					</Link>
				</ListItem>
				<ListItem>
					getServerSideProps calls a Promise that rejects, but does not handle the rejection or await its result
					(returning synchronously).
					<Link color="red.500" href="/bugsnag/ssr/scenario3" target="_blank">
						Open in a new tab
					</Link>
				</ListItem>
				<ListItem>
					getServerSideProps manually captures an exception from a try/catch.{' '}
					<Link color="red.500" href="/bugsnag/ssr/scenario4" target="_blank">
						Open in a new tab
					</Link>
				</ListItem>
			</OrderedList>
			<ListItem>Client exceptions</ListItem>
			<OrderedList>
				<ListItem>
					There is a top-of-module Promise that rejects, but its result is not awaited.{' '}
					<Link as={NextLink} color="red.500" href="/bugsnag/client/scenario1">
						Perform client side navigation
					</Link>{' '}
					or{' '}
					<Link color="red.500" href="/bugsnag/client/scenario1" target="_blank">
						Open in a new tab
					</Link>
				</ListItem>
				<ListItem>
					There is a top-of-module exception. _error.js should render.{' '}
					<Link as={NextLink} color="red.500" href="/bugsnag/client/scenario2">
						Perform client side navigation
					</Link>{' '}
					or{' '}
					<Link color="red.500" href="/bugsnag/client/scenario2" target="_blank">
						Open in a new tab
					</Link>
				</ListItem>
				<ListItem>
					There is an exception during React lifecycle that is caught by Next.js's React Error Boundary. In this case,
					when the component mounts. This should cause _error.js to render.{' '}
					<Link as={NextLink} color="red.500" href="/bugsnag/client/scenario3">
						Perform client side navigation
					</Link>{' '}
					or{' '}
					<Link color="red.500" href="/bugsnag/client/scenario3" target="_blank">
						Open in a new tab
					</Link>
				</ListItem>
				<ListItem>
					There is an unhandled Promise rejection during React lifecycle. In this case, when the component mounts.{' '}
					<Link as={NextLink} color="red.500" href="/bugsnag/client/scenario4">
						Perform client side navigation
					</Link>{' '}
					or{' '}
					<Link color="red.500" href="/bugsnag/client/scenario4" target="_blank">
						Open in a new tab
					</Link>
				</ListItem>
				<ListItem>
					An Error is thrown from an event handler.{' '}
					<Link as={NextLink} color="red.500" href="/bugsnag/client/scenario5">
						Perform client side navigation
					</Link>{' '}
					or{' '}
					<Link color="red.500" href="/bugsnag/client/scenario5" target="_blank">
						Open in a new tab
					</Link>
				</ListItem>
				<ListItem>
					There is an exception during React lifecycle that is caught by the closest parent Error Boundary.{' '}
					<Link as={NextLink} color="red.500" href="/bugsnag/client/scenario6">
						Perform client side navigation
					</Link>{' '}
					or{' '}
					<Link color="red.500" href="/bugsnag/client/scenario6" target="_blank">
						Open in a new tab
					</Link>
				</ListItem>
			</OrderedList>
		</OrderedList>
	</Box>
);

export default BugsnagPage;
