import { Icon, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FaGlobeEurope } from 'react-icons/fa';
import { ariaAttr } from '@chakra-ui/utils';

export const LanguageMenu = () => {
	const { pathname, query, locale: currentLocale, locales } = useRouter();

	return (
		<Menu placement="bottom">
			<MenuButton
				as={IconButton}
				aria-label="Toggle language"
				icon={<Icon as={FaGlobeEurope} w="16px" />}
				variant="ghost"
			/>
			<MenuList>
				{locales?.map((locale) => (
					<MenuItem
						key={locale}
						as={NextLink}
						_selected={{
							fontWeight: 'bold',
							bg: 'gray.100',
							_dark: {
								bg: 'gray.800',
							},
						}}
						aria-selected={ariaAttr(locale === currentLocale)}
						href={{ pathname, query }}
						locale={locale}
					>
						{locale}
					</MenuItem>
				))}
			</MenuList>
		</Menu>
	);
};
