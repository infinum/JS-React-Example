import React, { FC } from 'react';
import { Box, Flex, Image, useColorMode, IconButton, Button, Heading, LinkBox, LinkOverlay } from '@chakra-ui/react';
import NextLink from 'next/link';

import { NavigationWrapper } from './Navigation.elements';

import MoonIcon from '@/assets/icons/ic-moon.svg';
import SunIcon from '@/assets/icons/ic-sun.svg';

export const Navigation: FC = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<NavigationWrapper>
			<Flex justifyContent="space-between" alignItems="center">
				<LinkBox>
					<NextLink href="/" passHref>
						<LinkOverlay>
							<Image src="/images/logo-infinum.png" htmlWidth="64px" />
						</LinkOverlay>
					</NextLink>
				</LinkBox>
				<Heading size="lg">React example</Heading>
				<Box>
					<Button disabled mr={2}>
						Logout
					</Button>
					<IconButton
						aria-label="Toggle color mode"
						onClick={toggleColorMode}
						icon={<Box w="16px" as={colorMode === 'light' ? MoonIcon : SunIcon} />}
					/>
				</Box>
			</Flex>
		</NavigationWrapper>
	);
};
