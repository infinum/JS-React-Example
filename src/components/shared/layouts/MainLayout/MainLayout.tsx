import { FC, Fragment, ReactNode, Suspense } from 'react';

import { MainNavigation } from '@/components/shared/navigations/MainNavigation/MainNavigation';
import { Meta } from '@/components/shared/utilities/Meta/Meta';
import { MainFooter } from '@/components/shared/footers/MainFooter/MainFooter';

interface IMainLayoutProps {
	children?: ReactNode;
}

export const MainLayout: FC<IMainLayoutProps> = ({ children }) => (
	<Fragment>
		<Meta />
		<Suspense fallback={null}>
			<MainNavigation />
		</Suspense>
		{children}
		<MainFooter />
	</Fragment>
);
