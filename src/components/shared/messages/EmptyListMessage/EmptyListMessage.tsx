import React, { FC } from 'react';
import { Center, Heading, Image } from '@chakra-ui/react';

export const EmptyListMessage: FC = () => (
	<Center flexDirection="column" my={8}>
		<Image src="/images/logo-js.png" alt="presentations" width="64px" mb={6} />
		<Heading as="h5" size="md" variant="tertiary">
			Ducky has nothing todo!
		</Heading>
	</Center>
);
