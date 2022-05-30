import React, { FC } from 'react';
import { BoxProps, Container, Flex } from '@chakra-ui/react';

export const AuthLayout: FC<BoxProps> = ({ children }) => {
	return (
		<Container m={4} pr={64} bgColor="red" size="md">
			<Flex m={4}>Test</Flex>
			{children}
		</Container>
	);
};
