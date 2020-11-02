import React, { FC } from 'react';
import { Container, Heading, Image, Text } from '@chakra-ui/core';
import { Section } from '@/components/ui/atoms/Section/Section';

export const ProductSection: FC = (props) => {
	return (
		<Section variant="dimmed" py="10" {...props}>
			<Container maxW="md">
				<Heading>The Product</Heading>
				<Text color="gray.500">
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
					dolore magna aliquyam erat, sed diam voluptua.
				</Text>
				<Image src="/images/undraw_Post_online_re_1b82.svg" />
			</Container>
		</Section>
	);
};
