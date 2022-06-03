import React, { FC } from 'react';
import { BoxProps, Container } from '@chakra-ui/react';

export const AuthLayout: FC<BoxProps> = ({ children }) => {
	return (
		<Container pr={64} size="md">
			{children}
		</Container>
	);
};
