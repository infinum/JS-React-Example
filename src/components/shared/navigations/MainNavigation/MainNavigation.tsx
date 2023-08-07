import { FC } from 'react';
import { HStack, Flex, useColorMode, IconButton, Button, useToast, Icon, Container, Box, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Response } from '@datx/jsonapi';
import { useMutation, useClient } from '@datx/swr';
import { useSWRConfig } from 'swr';
import { useTranslation } from 'next-i18next';
import { FaMoon, FaSun } from 'react-icons/fa';

import { NavLink } from './MainNavigation.elements';
import { useSession } from '@/hooks/use-session';
import { logout } from '@/mutations/auth';
import { LanguageMenu } from '@/components/shared/navigations/MainNavigation/components/LanguageMenu';
import { UserMenu } from '@/components/shared/navigations/MainNavigation/components/UserMenu';

export const MainNavigation: FC = () => {
	const { t } = useTranslation(['common', 'main-navigation']);
	const { colorMode, toggleColorMode } = useColorMode();
	const toast = useToast();
	const { mutate } = useSWRConfig();
	const client = useClient();

	const { data } = useSession();

	const [logoutMutation] = useMutation(logout, {
		onFailure: ({ error: errorResponse }) => {
			if (errorResponse instanceof Response) {
				const { error } = errorResponse;
				const message = error instanceof Error ? error.message : error?.[0].detail;

				toast({ title: message, status: 'error' });
			}
		},
		onSuccess: async () => {
			await mutate(() => true, undefined, { revalidate: false });
			client.reset();
		},
	});

	const handleLogout = () => {
		logoutMutation(undefined).catch(console.error);
	};

	return (
		<Box as="nav" borderBottom="1px" borderBottomColor="chakra-border-color">
			<Container as={Flex} align="center" justify="space-between" py={2} size="xl">
				<NextLink href="/">
					<Text color="red.500" fontSize="3xl">
						Cekila
					</Text>
				</NextLink>

				<HStack flex="1" px={8} spacing={4}>
					<NavLink as={NextLink} href="/">
						{t('main-navigation:nav.home')}
					</NavLink>
					<NavLink as={NextLink} href="/flights">
						{t('main-navigation:nav.flights')}
					</NavLink>
				</HStack>

				<HStack>
					<LanguageMenu />
					<IconButton
						aria-label="Toggle color mode"
						icon={<Icon as={colorMode === 'light' ? FaMoon : FaSun} w="16px" />}
						onClick={toggleColorMode}
						variant="ghost"
					/>
					{data?.data.user ? (
						<UserMenu user={data?.data.user} onLogout={handleLogout} />
					) : (
						<Button as={NextLink} colorScheme="red" href="/login">
							{t('main-navigation:auth.login.label')}
						</Button>
					)}
				</HStack>
			</Container>
		</Box>
	);
};
