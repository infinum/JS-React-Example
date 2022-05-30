import React, { FC, useCallback } from 'react';
import {
	HStack,
	Flex,
	Image,
	useColorMode,
	IconButton,
	Button,
	Heading,
	LinkBox,
	LinkOverlay,
	useToast,
	Icon,
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

	const { user, logout } = useSession();

	const handleLogout = useCallback(async () => {
		try {
			await logout();
		} catch (errorResponse) {
			if (errorResponse instanceof Response) {
				const { error } = errorResponse;
				const message = error instanceof Error ? error.message : error[0].detail;
				toast({ title: message, status: 'error' });
			}
		}
	}, [logout, toast]);

	return (
		<NavigationWrapper>
			<Flex align="center" justify="space-between">
				<LinkBox>
					<NextLink href="/" passHref>
						<LinkOverlay>
							<Image htmlWidth="64px" src="/images/logo-infinum.png" />
						</LinkOverlay>
					</NextLink>
				</LinkBox>
				<Heading size="lg">React example</Heading>
				<HStack>
					{user ? (
						<Button aria-label="Log out from this page" onClick={handleLogout}>
							Logout
						</Button>
					) : (
						<Button as="a" href="/login">
							Login
						</Button>
					)}
					<IconButton
						aria-label="Toggle color mode"
						icon={<Icon as={colorMode === 'light' ? MoonIcon : SunIcon} w="16px" />}
						onClick={toggleColorMode}
					/>
				</HStack>
			</Flex>
		</NavigationWrapper>
	);
};
