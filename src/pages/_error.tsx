import React from 'react';
import { NextPage, NextPageContext } from 'next';
import NextErrorComponent, { ErrorProps } from 'next/error';
import { Container, Heading, Image, Center } from '@chakra-ui/react';
import Bugsnag, { Request } from '@bugsnag/js';

export interface ICustomErrorPageProps extends ErrorProps {
	err?: Error;
	hasGetInitialPropsRun?: boolean;
}

const CustomErrorPage: NextPage<ICustomErrorPageProps> = ({ statusCode, hasGetInitialPropsRun, err }) => {
	if (!hasGetInitialPropsRun && err) {
		// getInitialProps is not called in case of
		// https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
		// err via _app.js so it can be captured
		Bugsnag.notify(err, (event) => {
			event.severity = 'error';
			event.unhandled = true;
		});
	}

	return (
		<Container h="100%">
			<Center flexDir="column" h="100%">
				<Heading my={8} size="4xl">
					{statusCode}
				</Heading>
				<Heading size="xl">Error occurred!</Heading>
				<Image w="100%" alt="presentation" src="/images/infinum-contruction.png" />
			</Center>
		</Container>
	);
};

CustomErrorPage.getInitialProps = async (ctx: NextPageContext) => {
	const { req, err, asPath } = ctx;
	const errorInitialProps = await NextErrorComponent.getInitialProps(ctx);

	// Workaround for https://github.com/vercel/next.js/issues/8592, mark when
	// getInitialProps has run
	const hasGetInitialPropsRun = true;

	// Running on the server, the response object (`res`) is available.
	//
	// Next.js will pass an err on the server if a page's data fetching methods
	// threw or returned a Promise that rejected
	//
	// Running on the client (browser), Next.js will provide an err if:
	//
	//  - a page's `getInitialProps` threw or returned a Promise that rejected
	//  - an exception was thrown somewhere in the React lifecycle (render,
	//    componentDidMount, etc) that was caught by Next.js's React Error
	//    Boundary. Read more about what types of exceptions are caught by Error
	//    Boundaries: https://reactjs.org/docs/error-boundaries.html

	if (err) {
		Bugsnag.notify(err, (event) => {
			event.severity = 'error';
			event.unhandled = true;

			if (req) {
				event.request = req as unknown as Request;
			}
		});

		// Flushing before returning is necessary if deploying to Vercel, see
		// https://vercel.com/docs/platform/limits#streaming-responses
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		await require('@bugsnag/in-flight').flush(2000);

		return {
			...errorInitialProps,
			hasGetInitialPropsRun,
		};
	}

	// If this point is reached, getInitialProps was called without any
	// information about what the error might be. This is unexpected and may
	// indicate a bug introduced in Next.js, so record it in Bugsnag
	Bugsnag.notify(new Error(`_error.js getInitialProps missing data at path: ${asPath}`), (event) => {
		event.severity = 'error';
		event.unhandled = true;

		if (req) {
			event.request = req as unknown as Request;
		}
	});

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	await require('@bugsnag/in-flight').flush(2000);

	return {
		...errorInitialProps,
		hasGetInitialPropsRun,
	};
};

export default CustomErrorPage;
