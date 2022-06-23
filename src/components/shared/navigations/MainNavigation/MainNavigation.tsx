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
import { useMutation, useClient } from '@datx/swr';
import { useSWRConfig } from 'swr';
import { useTranslation } from 'next-i18next';
import { FaMoon, FaSun } from 'react-icons/fa';

import { NavigationWrapper } from './MainNavigation.elements';
import { useSession } from '@/hooks/use-session';
import { logout } from '@/mutations/auth';

export const MainNavigation: FC = () => {
	const { t } = useTranslation(['common', 'mainNavigation']);
	const { colorMode, toggleColorMode } = useColorMode();
	const toast = useToast();
	const { cache } = useSWRConfig();
	const client = useClient();

	const { data } = useSession();

	const [handleLogout] = useMutation(logout, {
		onFailure: ({ error: errorResponse }) => {
			if (errorResponse instanceof Response) {
				const { error } = errorResponse;
				const message = error instanceof Error ? error.message : error[0].detail;
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
		<NavigationWrapper>
			<Flex align="center" justify="space-between">
				<LinkBox>
					<NextLink href="/" passHref>
						<LinkOverlay>
							<Image htmlWidth="64px" src="/images/logo-infinum.png" />
						</LinkOverlay>
					</NextLink>
				</LinkBox>
				<Heading size="lg">{t('mainNavigation:heading')}</Heading>
				<HStack>
					{data?.data.user ? (
						<Button aria-label="Log out from this page" onClick={handleLogout}>
							{t('mainNavigation:auth.logout.label')}
						</Button>
					) : (
						<Button as="a" href="/login">
							{t('mainNavigation:auth.login.label')}
						</Button>
					)}
					<IconButton
						aria-label="Toggle color mode"
						icon={<Icon as={colorMode === 'light' ? FaMoon : FaSun} w="16px" />}
						onClick={toggleColorMode}
					/>
				</HStack>
			</Flex>
		</NavigationWrapper>
	);
};
