import React, { FC } from 'react';
import { Box, Flex, Image, useColorMode, IconButton, Button, Heading } from '@chakra-ui/react';

import { NavigationWrapper } from './Navigation.elements';

import MoonIcon from '@/assets/icons/ic-moon.svg';
import SunIcon from '@/assets/icons/ic-sun.svg';

export const Navigation: FC = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<NavigationWrapper>
			<Flex justifyContent="space-between" alignItems="center">
				<Image src="/images/logo-infinum.png" htmlWidth="64px" />
				<Heading size="lg">React example</Heading>
				<Box>
					<Button disabled mr={2}>
						Logout
					</Button>
					<IconButton
						aria-label="Toggle color mode"
						onClick={toggleColorMode}
						icon={colorMode === 'light' ? <Box w="16px" as={MoonIcon} /> : <Box w="16px" as={SunIcon} />}
					/>
				</Box>
			</Flex>
		</NavigationWrapper>
	);
};
