import React from 'react';
import { NextPage, NextPageContext } from 'next';
import { Container, Heading, Image, Center } from '@chakra-ui/react';

interface IErrorProps {
	statusCode?: number;
}

const Error: NextPage<IErrorProps> = ({ statusCode }) => {
	return (
		<Container h="100%">
			<Center flexDir="column" h="100%">
				<Heading my={8} size="4xl" variant="tertiary">
					{statusCode}
				</Heading>
				<Heading size="xl" variant="tertiary">
					Error occurred!
				</Heading>
				<Image w="100%" alt="presentation" src="/images/infinum-contruction.png" />
			</Center>
		</Container>
	);
};

Error.getInitialProps = (ctx: NextPageContext) => {
	const { res, err } = ctx;
	let statusCode = undefined;

	if (typeof window == 'undefined') {
		const newrelic = require('newrelic');
		newrelic.noticeError(err);
	} else {
		window['newrelic']?.noticeError?.(err);
	}

	if (res) {
		statusCode = res.statusCode;
	} else if (err) {
		statusCode = err.statusCode;
	} else {
		statusCode = 500;
	}

	return { statusCode };
};

export default Error;
