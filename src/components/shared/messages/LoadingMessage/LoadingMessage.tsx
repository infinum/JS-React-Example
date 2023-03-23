import React, { FC } from 'react';
import { Center, CenterProps, Image, Text } from '@chakra-ui/react';

export interface ILoadingMessage extends CenterProps {
	message?: string;
}

export const LoadingMessage = ({ message = 'Loading...', ...centerProps }: ILoadingMessage) => (
	<Center h="100%" {...centerProps}>
		<Image w="240px" alt="presentation" src="/images/logo-infinum.png" />
		<Text ml={10} color="red" fontSize="3xl">
			{message}
		</Text>
	</Center>
);
