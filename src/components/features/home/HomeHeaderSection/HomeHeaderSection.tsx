import { Box, Button, Container, Heading, Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import { FC } from 'react';
import NextLink from 'next/link';

export interface IHomeHeaderSectionProps {}

export const HomeHeaderSection: FC<IHomeHeaderSectionProps> = () => {
	return (
		<Box as="section">
			<Container minW="container.lg" py={{ base: '16', md: '24' }}>
				<Stack spacing={{ base: '8', md: '10' }}>
					<Stack align="center" spacing={{ base: '4', md: '5' }}>
						<Heading size={{ base: 'sm', md: 'md' }}>Ready to Fly?</Heading>
						<Text maxW="2xl" color="muted" fontSize="xl" textAlign="center">
							With this beautiful and responsive React components you will realize your next project in no time.
						</Text>
					</Stack>
					<Stack justify="center" direction={{ base: 'column', sm: 'row' }} spacing="3">
						<Button colorScheme="red" size="lg">
							Learn more
						</Button>
						<NextLink href="/flights" passHref legacyBehavior>
							<Button as="a" size="lg">
								Check Flights
							</Button>
						</NextLink>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
};
