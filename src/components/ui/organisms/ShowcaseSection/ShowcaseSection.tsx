import React, { FC } from 'react';
import { Container, Heading, Image, Text } from '@chakra-ui/core';
import { Section } from '@/components/ui/atoms/Section/Section';
import { Banner } from '@/components/ui/molecules/Banner/Banner';

export const ShowcaseSection: FC = (props) => {
	return (
		<Section py="10" {...props}>
			<Container maxW="lg">
				<Heading textAlign="center">Showcase</Heading>
				<Text textAlign="center" color="gray.500">
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
					dolore magna aliquyam erat, sed diam voluptua.
				</Text>
				<Image src="/images/undraw_features_overview_jg7a.svg" />
				<Banner
					title="Lorem ipsum dolor sit amet, consetetur sadipscing elitr"
					description="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore"
					actionLabel="Talk to Us"
					onActionClick={console.log}
				/>
			</Container>
		</Section>
	);
};
