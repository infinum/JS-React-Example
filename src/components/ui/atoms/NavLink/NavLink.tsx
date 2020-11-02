import { chakra, forwardRef, HTMLChakraProps, ThemingProps, useColorModeValue } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React from 'react';

export interface INavLinkProps extends HTMLChakraProps<'a'>, ThemingProps {}

export const NavLink = forwardRef<INavLinkProps, 'a'>(function NavLink(props, ref) {
	const { href, ...rest } = props;
	const { pathname } = useRouter();

	const group = href.split('/')[1];
	const isActive = pathname.includes(group);

	return (
		<chakra.a
			ref={ref}
			aria-current={isActive ? 'page' : undefined}
			display="block"
			py="1"
			px="3"
			borderRadius="4px"
			transition="all 0.2s"
			color={useColorModeValue('gray.600', 'whiteAlpha.800')}
			fontWeight="semibold"
			_hover={{ color: useColorModeValue('gray.900', 'whiteAlpha.600') }}
			_activeLink={{
				fontWeight: 'bold',
				color: 'primary',
			}}
			href={href}
			{...rest}
		/>
	);
});
