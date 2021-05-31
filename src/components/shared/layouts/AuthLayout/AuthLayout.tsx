import React, { FC } from 'react';
import { BoxProps, Container } from '@chakra-ui/react';

export const AuthLayout: FC<BoxProps> = ({ children }) => {
	return (
		<Container size="md" py={32}>
			{children}
		</Container>
	);
};
