import React, { FC } from 'react';
import { Container, Heading, Image, Text } from '@chakra-ui/react';
import { Section } from '@atoms/Section/Section';

export const ProductSection: FC = (props) => {
	return (
		<Section variant="dimmed" py={20} {...props}>
			<Container maxW="md">
				<Heading textAlign="center" mb={6}>
					The Product
				</Heading>
				<Text color="gray.500" textAlign="center" maxW="md" mx="auto">
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
					dolore magna aliquyam erat, sed diam voluptua.
				</Text>
				<Image src="/images/undraw_Post_online_re_1b82.svg" title="Product" mt={8} mx="auto" w="xs" maxW="100%" />
			</Container>
		</Section>
	);
};
