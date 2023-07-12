import { User } from '@/models/User';
import { Avatar, forwardRef, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';

export interface IUserMenuProps {
	user?: User;
	onLogout?: (...args: Array<any>) => void;
}

export const UserMenu = forwardRef<IUserMenuProps, 'div'>((props, ref) => {
	const { t } = useTranslation('main-navigation');
	const { user, onLogout } = props;

	return (
		<Menu placement="bottom-end">
			<MenuButton
				ref={ref}
				as={IconButton}
				aria-label="Toggle language"
				icon={<Avatar name={`${user?.firstName} ${user?.lastName}`} size="sm" />}
				variant="ghost"
			/>
			<MenuList>
				<MenuItem aria-label="Log out from this page" onClick={onLogout}>
					{t('auth.logout.label')}
				</MenuItem>
			</MenuList>
		</Menu>
	);
});
