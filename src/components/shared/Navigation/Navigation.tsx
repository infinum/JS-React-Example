import React, { FC } from 'react';
import { Box, Flex, Image, useColorMode, IconButton, Button } from '@chakra-ui/react';

import { NavigationWrapper } from './Navigation.elements';

import MoonIcon from '@/assets/icons/ic-moon.svg';
import SunIcon from '@/assets/icons/ic-sun.svg';

export const Navigation: FC = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<NavigationWrapper>
			<Flex justifyContent="space-between">
				<Image src="/images/logo.png" htmlWidth="80px" />
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
