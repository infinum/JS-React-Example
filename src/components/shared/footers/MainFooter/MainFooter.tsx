import { Box, Button, ButtonGroup, Container, Divider, IconButton, Image, Input, Stack, Text } from '@chakra-ui/react';
import * as React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import NextLink from 'next/link';

export const MainFooter = () => (
	<Box as="footer" bg="bg-surface" role="contentinfo">
		<Container size="xl">
			<Stack
				justify="space-between"
				direction={{ base: 'column', md: 'row' }}
				py={{ base: '12', md: '16' }}
				spacing="8"
			>
				<Stack align="start" minW="0" spacing={{ base: '6', md: '8' }}>
					<NextLink href="/">
						<Image htmlWidth="64px" src="/images/logo-infinum.png" />
					</NextLink>
					<Text color="muted">Create beautiful websites remarkably fast.</Text>
				</Stack>

				<Stack
					direction={{ base: 'column-reverse', md: 'column', lg: 'row' }}
					minW="0"
					spacing={{ base: '12', md: '8' }}
				>
					<Stack direction="row" spacing="8">
						<Stack flex="1" minW="36" spacing="4">
							<Text color="subtle" fontSize="sm" fontWeight="semibold">
								Product
							</Text>
							<Stack shouldWrapChildren spacing="3">
								<Button variant="link">How it works</Button>
								<Button variant="link">Pricing</Button>
								<Button variant="link">Use Cases</Button>
							</Stack>
						</Stack>
						<Stack flex="1" minW="36" spacing="4">
							<Text color="subtle" fontSize="sm" fontWeight="semibold">
								Legal
							</Text>
							<Stack shouldWrapChildren spacing="3">
								<Button variant="link">Privacy</Button>
								<Button variant="link">Terms</Button>
								<Button variant="link">License</Button>
							</Stack>
						</Stack>
					</Stack>
					<Stack spacing="4">
						<Text color="subtle" fontSize="sm" fontWeight="semibold">
							Stay up to date
						</Text>
						<Stack direction={{ base: 'column', sm: 'row' }} maxW={{ lg: '360px' }} spacing="4">
							<Input placeholder="Enter your email" required type="email" />
							<Button flexShrink={0} colorScheme="red" type="submit">
								Subscribe
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</Stack>

			<Divider />

			<Stack align="center" justify="space-between" direction={{ base: 'column-reverse', md: 'row' }} pt="8" pb="12">
				<Text color="subtle" fontSize="sm">
					&copy; {new Date().getFullYear()} Infinum Inc.
				</Text>
				<ButtonGroup variant="ghost">
					<IconButton as="a" aria-label="LinkedIn" href="#" icon={<FaLinkedin fontSize="1.25rem" />} />
					<IconButton as="a" aria-label="GitHub" href="#" icon={<FaGithub fontSize="1.25rem" />} />
					<IconButton as="a" aria-label="Twitter" href="#" icon={<FaTwitter fontSize="1.25rem" />} />
				</ButtonGroup>
			</Stack>
		</Container>
	</Box>
);
