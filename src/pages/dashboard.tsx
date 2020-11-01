import { ReactElement } from 'react';

import { DashboardLayout } from '@/components/layouts/DashboardLayout/DashboardLayout';
import { Seo } from '@/components/ui/organisms/Seo/Seo';

export default function Dashboard(): ReactElement {
	return (
		<DashboardLayout>
			<Seo title="Dashboard Page" description="JS-React-Example dashboard page" />
		</DashboardLayout>
	);
}
