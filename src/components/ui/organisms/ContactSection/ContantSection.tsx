import React, { FC } from 'react';
import { Container, Heading } from '@chakra-ui/react';
import { Section } from '@atoms/Section/Section';
import { ContactForm } from '@molecules/ContactForm/ContactForm';

export const ContactSection: FC = (props) => {
	return (
		<Section py="10" {...props}>
			<Container maxW="lg">
				<Heading textAlign="center" mb={10}>
					Contact
				</Heading>
				<ContactForm />
			</Container>
		</Section>
	);
};
