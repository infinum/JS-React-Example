import React from 'react';
import { chakra, ChakraComponent, Container, Text } from '@chakra-ui/core';

export const Footer: ChakraComponent<'div', {}> = (props) => (
	<chakra.div
		as="footer"
		sx={{ borderTop: '1px solid', borderTopColor: 'gray.200', bg: 'gray.50', position: 'sticky', top: 0 }}
		{...props}
	>
		<Container maxW="xl" py={5}>
			<Text textAlign="center">Copyright © 2020. All rights reserved.</Text>
		</Container>
	</chakra.div>
);
