import React, { FC } from 'react';
import { BoxProps, Container, Flex } from '@chakra-ui/react';

export const AuthLayout: FC<BoxProps> = ({ children }) => {
	return (
		<Container pr={64} size="md">
			<Flex m={4}>Test</Flex>
			{children}
		</Container>
	);
};
