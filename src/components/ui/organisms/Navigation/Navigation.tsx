import React from 'react';
import { chakra, Container, Flex, Text, Icon, Circle, ChakraComponent } from '@chakra-ui/react';
import NextLink from 'next/link';
import { AiFillGithub } from 'react-icons/ai';
import { FaReact } from 'react-icons/fa';
import useHeadroom from 'use-headroom';

import { NavLink } from '@atoms/NavLink/NavLink';

export const Navigation: ChakraComponent<'div', {}> = (props) => {
	const isPinned = useHeadroom({ fixAt: 81 });

	return (
		<chakra.div
			as="header"
			sx={{
				bg: 'whiteAlpha.900',
				backdropFilter: 'saturate(180%) blur(5px)',
				borderBottom: '1px solid',
				borderBottomColor: 'gray.200',
				position: 'fixed',
				width: '100%',
				top: 0,
				zIndex: 20000,
				transition: 'transform 0.2s',
			}}
			{...props}
			style={{
				transform: isPinned ? `translate3d(0,0px,0)` : `translate3d(0,-100px,0)`,
			}}
		>
			<Container
				maxW="lg"
				minH={['80px']}
				sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
			>
				<NextLink href="/" passHref>
					<Text as="a" fontSize="3xl" fontWeight="bold" color="gray.600" display="flex">
						<Circle size="40px" bg="primary" color="white">
							<Icon as={FaReact} />
						</Circle>
						<Text as="span" ml="3">
							Example
						</Text>
					</Text>
				</NextLink>
				<Flex>
					<NavLink href="/#home">Home</NavLink>
					<NavLink href="/#about">About</NavLink>
					<NavLink href="/#showcase">Showcase</NavLink>
					<NavLink href="/#contact">Contact</NavLink>
				</Flex>
				<Flex>
					<Icon as={AiFillGithub} boxSize={8} />
				</Flex>
			</Container>
		</chakra.div>
	);
};
