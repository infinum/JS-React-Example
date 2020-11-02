import React from 'react';
import { chakra, ChakraComponent, Container, Text, Link, HStack, VStack } from '@chakra-ui/core';

export const Footer: ChakraComponent<'div', {}> = (props) => (
	<chakra.div
		as="footer"
		sx={{ borderTop: '1px solid', borderTopColor: 'gray.200', bg: 'gray.50', position: 'sticky', top: 0 }}
		{...props}
	>
		<Container maxW="xl">
			<HStack width="100%">
				<VStack>
					<Text>General resources</Text>
					<VStack>
						<Link>Docs</Link>
						<Link>Learn</Link>

						<Link>Showcase</Link>

						<Link>Blog</Link>

						<Link>Analytics</Link>

						<Link>Next.js Conf</Link>
					</VStack>
				</VStack>
				<VStack>
					<Text>More</Text>
					<VStack>
						<Link>Docs</Link>
						<Link>Learn</Link>

						<Link>Showcase</Link>

						<Link>Blog</Link>

						<Link>Analytics</Link>
					</VStack>
				</VStack>
				<VStack>
					<Text>About</Text>
					<VStack>
						<Link>Docs</Link>
						<Link>Learn</Link>

						<Link>Showcase</Link>

						<Link>Blog</Link>

						<Link>Analytics</Link>

						<Link>Next.js Conf</Link>
					</VStack>
				</VStack>
				<VStack>
					<Text>Legal</Text>
					<VStack>
						<Link>Docs</Link>
						<Link>Learn</Link>

						<Link>Showcase</Link>

						<Link>Blog</Link>

						<Link>Analytics</Link>

						<Link>Next.js Conf</Link>
					</VStack>
				</VStack>
			</HStack>
			Copyright © 2020, Inc. All rights reserved.
		</Container>
	</chakra.div>
);
