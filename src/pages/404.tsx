import React, { FC } from 'react';
import { Container, Heading, Image, Center } from '@chakra-ui/react';

const NotFound: FC = () => {
	return (
		<Container height="100%">
			<Center height="100%" flexDirection="column">
				<Heading my={8} size="4xl" color="infinum.500">
					404
				</Heading>
				<Heading size="xl" color="infinum.500">
					Error occurred!
				</Heading>
				<Image src="/images/infinum-contruction.png" alt="presentation" width="100%" />
			</Center>
		</Container>
	);
};

export default NotFound;
