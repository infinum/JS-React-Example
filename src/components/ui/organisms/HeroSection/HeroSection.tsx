import React, { FC } from 'react';
import { Flex, Box, Text, Button, Container, Heading, Image } from '@chakra-ui/core';
import { Section } from '@ui/atoms/Section/Section';
import { ColorModeSwitch } from '@ui/molecules/ColorModeSwitch/ColorModeSwitch';

export const HeroSection: FC = (props) => {
	return (
		<Section pt={48} pb={24} {...props}>
			<Container maxW="lg">
				<Flex>
					<Box flex={1} pr={6}>
						<Heading mb={5}>Landing page template</Heading>
						<Text mb={5} color="gray.500">
							Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
							et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
						</Text>
						<Flex justifyContent="flex-start" alignItems="center">
							<Button colorScheme="blue" size="lg" px="40px" minW={0}>
								CLICK ME NOW
							</Button>
							<Box ml={4}>
								<ColorModeSwitch />
							</Box>
						</Flex>
					</Box>
					<Box flex={1} pl={6}>
						<Image src="/images/undraw_Collection_re_4h7d.svg" />
					</Box>
				</Flex>
			</Container>
		</Section>
	);
};
