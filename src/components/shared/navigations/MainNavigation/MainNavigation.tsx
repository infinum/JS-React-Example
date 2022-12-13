import React, { FC } from 'react';
import {
	HStack,
	Flex,
	Image,
	useColorMode,
	IconButton,
	Button,
	useToast,
	Icon,
	Container,
	Box,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Response } from '@datx/jsonapi';
import { useMutation, useClient } from '@datx/swr';
import { useSWRConfig } from 'swr';
import { useTranslation } from 'next-i18next';
import { FaMoon, FaSun } from 'react-icons/fa';

import { NavLink } from './MainNavigation.elements';
import { useSession } from '@/hooks/use-session';
import { logout } from '@/mutations/auth';
import { LanguageDropdown } from '@/components/shared/navigations/MainNavigation/components/LanguageDropdown/LanguageDropdown';

export const MainNavigation: FC = () => {
	const { t } = useTranslation(['common', 'main-navigation']);
	const { colorMode, toggleColorMode } = useColorMode();
	const toast = useToast();
	const { cache } = useSWRConfig();
	const client = useClient();

	const { data } = useSession();

	const [handleLogout] = useMutation(logout, {
		onFailure: ({ error: errorResponse }) => {
			if (errorResponse instanceof Response) {
				const { error } = errorResponse;
				const message = error instanceof Error ? error.message : error?.[0].detail;
				toast({ title: message, status: 'error' });
			}
		},
		onSuccess: () => {
			// @ts-ignore
			cache.clear();
			client.reset();
		},
	});

	return (
		<Box as="nav" shadow="md">
			<Container as={Flex} align="center" justify="space-between" py={4} size="xl">
				<NextLink href="/">
					<Image htmlWidth="64px" src="/images/logo-infinum.png" />
				</NextLink>

				<HStack>
					<NavLink as={NextLink} href="/">
						{t('main-navigation:nav.home')}
					</NavLink>
					<NavLink as={NextLink} href="/flights">
						{t('main-navigation:nav.flights')}
					</NavLink>
				</HStack>

				<HStack>
					<LanguageDropdown />
					{data?.data.user ? (
						<Button aria-label="Log out from this page" onClick={handleLogout}>
							{t('main-navigation:auth.logout.label')}
						</Button>
					) : (
						<Button as={NextLink} href="/login">
							{t('main-navigation:auth.login.label')}
						</Button>
					)}
					<IconButton
						aria-label="Toggle color mode"
						icon={<Icon as={colorMode === 'light' ? FaMoon : FaSun} w="16px" />}
						onClick={toggleColorMode}
					/>
				</HStack>
			</Container>
		</Box>
	);
};
