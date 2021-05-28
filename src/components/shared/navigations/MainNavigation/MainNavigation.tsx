import React, { FC } from 'react';
import {
	Box,
	Flex,
	Image,
	useColorMode,
	IconButton,
	Button,
	Heading,
	LinkBox,
	LinkOverlay,
	useToast,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Response } from '@datx/jsonapi';

import { NavigationWrapper } from './MainNavigation.elements';
import { useSession } from '@/hooks/useSession';

import MoonIcon from '@/assets/icons/ic-moon.svg';
import SunIcon from '@/assets/icons/ic-sun.svg';

export const MainNavigation: FC = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const toast = useToast();

	const { logout } = useSession({
		redirectTo: '/login',
		onLogoutError: (error) => {
			if (error instanceof Response) {
				toast({ title: error.error[0], status: 'error' });
			}
		},
	});

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
					<Button onClick={logout} mr={2}>
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
