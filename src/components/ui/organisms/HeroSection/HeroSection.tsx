import React, { FC } from 'react';
import { Flex, Box, Text, Button, Container, Heading, Image } from '@chakra-ui/core';
import { Section } from '@/components/ui/atoms/Section/Section';
import { ColorModeSwitch } from '@/components/ui/molecules/ColorModeSwitch/ColorModeSwitch';

export const HeroSection: FC = (props) => {
	return (
		<Section py="10" minH="100vh" {...props}>
			<Container maxW="lg">
				<Flex>
					<Box flex={1}>
						<Heading>Landing page template</Heading>
						<Text color="gray.500">
							Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
							et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
						</Text>
						<Flex>
							<Button colorScheme="blue" size="lg">
								CLICK ME NOW
							</Button>
							<ColorModeSwitch />
						</Flex>
					</Box>
					<Box flex={1}>
						<Image src="/images/undraw_Collection_re_4h7d.svg" />
					</Box>
				</Flex>
			</Container>
		</Section>
	);
};
