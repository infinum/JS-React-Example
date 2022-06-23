import React, { FC } from 'react';
import { Box, Container, Text } from '@chakra-ui/react';

export const MainFooter: FC = () => {
	return (
		<Box w="100%" px={6}>
			<Container>
				<Text textAlign="center">© 2022 Infinum Inc.</Text>
			</Container>
		</Box>
	);
};
