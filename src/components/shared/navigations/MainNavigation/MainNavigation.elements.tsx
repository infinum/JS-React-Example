import { Button, ButtonProps, chakra, forwardRef, StyleProps } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';

export interface INavigation extends StyleProps {
	children: ReactNode;
}
export const Navigation: FC<INavigation> = (props) => <chakra.nav py={6} mx="auto" maxWidth="800px" {...props} />;

export const NavLink = forwardRef<ButtonProps, 'a'>((props, ref) => {
	const router = useRouter();
	const isActive = router.pathname === props.href;

	return <Button ref={ref} as="a" borderRadius="full" isActive={isActive} size="sm" variant="ghost" {...props} />;
});
