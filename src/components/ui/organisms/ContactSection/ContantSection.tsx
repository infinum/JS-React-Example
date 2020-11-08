import React, { FC } from 'react';
import { Container, Heading } from '@chakra-ui/core';
import { Section } from '@ui/atoms/Section/Section';

export const ContactSection: FC = (props) => {
	return (
		<Section py="10" {...props}>
			<Container maxW="lg">
				<Heading textAlign="center">Contact</Heading>
			</Container>
		</Section>
	);
};
