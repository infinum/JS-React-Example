import { FC } from 'react';
import { Center, Heading, Image } from '@chakra-ui/react';

export const EmptyListMessage: FC = () => (
	<Center flexDir="column" my={8}>
		<Image w="64px" mb={6} role="presentation" src="/images/logo-js.png" />
		<Heading as="h5" size="md">
			Ducky has nothing todo!
		</Heading>
	</Center>
);
