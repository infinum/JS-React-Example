import React, { FC } from 'react';
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

	const { user, logout } = useSession({
		onLogoutError: (errorResponse) => {
			if (errorResponse instanceof Response) {
				const { error } = errorResponse;
				const message = error instanceof Error ? error.message : error[0].detail;
				toast({ title: message, status: 'error' });
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
				<HStack>
					{user ? (
						<Button onClick={logout} aria-label="Log out from this page">
							Logout
						</Button>
					) : (
						<Button as="a" href="/login">
							Login
						</Button>
					)}
					<IconButton
						aria-label="Toggle color mode"
						onClick={toggleColorMode}
						icon={<Icon w="16px" as={colorMode === 'light' ? MoonIcon : SunIcon} />}
					/>
				</HStack>
			</Flex>
		</NavigationWrapper>
	);
};
