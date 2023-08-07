import React, { FC } from 'react';
import { Center, CenterProps, Image, Text } from '@chakra-ui/react';

export const LoadingMessage: FC<CenterProps> = (props) => (
	<Center h="100%" {...props}>
		<Image w="240px" role="presentation" src="/images/logo-infinum.png" />
		<Text ml={10} color="red" fontSize="3xl">
			Loading...
		</Text>
	</Center>
);
