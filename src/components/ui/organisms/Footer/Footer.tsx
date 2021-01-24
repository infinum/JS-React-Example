import React from 'react';
import { chakra, Container, forwardRef, Text } from '@chakra-ui/react';

export const Footer = forwardRef<{}, 'div'>(function Footer(props, ref) {
	return (
		<chakra.div
			ref={ref}
			as="footer"
			sx={{ borderTop: '1px solid', borderTopColor: 'gray.200', bg: 'gray.50', position: 'sticky', top: 0 }}
			{...props}
		>
			<Container maxW="xl" py={5}>
				<Text textAlign="center">Copyright © 2020. All rights reserved.</Text>
			</Container>
		</chakra.div>
	);
});
