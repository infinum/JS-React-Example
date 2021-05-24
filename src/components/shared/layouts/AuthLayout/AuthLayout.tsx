import React, { FC } from 'react';
import { Box, BoxProps, Container } from '@chakra-ui/react';

export const AuthLayout: FC<BoxProps> = ({ children }) => {
	return (
		<Container size="md" py={64}>
			{children}
		</Container>
	);
};
