import React from 'react';
import { NextComponentType } from 'next';
import { Container, Heading, Image, Center } from '@chakra-ui/react';

const Error: NextComponentType = ({ statusCode }: any) => {
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

Error.getInitialProps = (ctx) => {
	const { res, err } = ctx;
	const statusCode = res ? res.statusCode : err ? err.statusCode : 500;

	return { statusCode };
};

export default Error;
