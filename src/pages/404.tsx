import { FC } from 'react';
import { Container, Heading, Image, Center } from '@chakra-ui/react';

const NotFound: FC = () => {
	return (
		<Container h="100%">
			<Center flexDir="column" h="100%">
				<Heading my={8} size="4xl">
					404
				</Heading>
				<Heading size="xl">Error occurred!</Heading>
				<Image w="100%" alt="presentation" src="/images/infinum-contruction.png" />
			</Center>
		</Container>
	);
};

export default NotFound;
