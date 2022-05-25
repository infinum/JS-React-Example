import React from 'react';
import { NextPage, NextPageContext } from 'next';
import { Container, Heading, Image, Center } from '@chakra-ui/react';

interface IErrorProps {
	statusCode?: number;
}

const Error: NextPage<IErrorProps> = ({ statusCode }) => {
	return (
		<Container height="100%">
			<Center height="100%" flexDirection="column">
				<Heading my={8} size="4xl" variant="tertiary">
					{statusCode}
				</Heading>
				<Heading size="xl" variant="tertiary">
					Error occurred!
				</Heading>
				<Image src="/images/infinum-contruction.png" alt="presentation" width="100%" />
			</Center>
		</Container>
	);
};

Error.getInitialProps = (ctx: NextPageContext) => {
	const { res, err } = ctx;
	let statusCode = undefined;

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
