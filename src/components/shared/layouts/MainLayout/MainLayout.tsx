import { FC, Fragment } from 'react';

import { MainNavigation } from '@/components/shared/navigations/MainNavigation/MainNavigation';
import { Meta } from '@/components/shared/utilities/Meta/Meta';
import { MainFooter } from '@/components/shared/footers/MainFooter/MainFooter';

export const MainLayout: FC = ({ children }) => (
	<Fragment>
		<Meta />
		<MainNavigation />
		{children}
		<MainFooter />
	</Fragment>
);
