import { chakra, forwardRef, ChakraProps } from '@chakra-ui/react';
import { ariaAttr } from '@chakra-ui/utils';
import { useRouter } from 'next/router';

export const NavLink = forwardRef<ChakraProps, 'a'>((props, ref) => {
	const router = useRouter();
	const isActive = router.pathname === props.href;

	return (
		<chakra.a
			ref={ref}
			borderRadius="full"
			aria-current={isActive ? 'page' : undefined}
			_activeLink={{
				color: 'red.500',
			}}
			{...props}
		/>
	);
});
