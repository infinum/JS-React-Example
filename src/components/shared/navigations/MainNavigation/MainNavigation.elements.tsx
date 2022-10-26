import { Button, ButtonProps, forwardRef } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export const NavLink = forwardRef<ButtonProps, 'a'>((props, ref) => {
	const router = useRouter();
	const isActive = router.pathname === props.href;

	return <Button ref={ref} as="a" borderRadius="full" isActive={isActive} size="sm" variant="ghost" {...props} />;
});
