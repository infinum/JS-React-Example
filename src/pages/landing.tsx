import { ReactElement } from 'react';

import { MainLayout } from '@/components/layouts/MainLayout/MainLayout';
import { Seo } from '@/components/ui/organisms/Seo/Seo';

export default function LandingPage(): ReactElement {
	return (
		<MainLayout>
			<Seo title="Landing Page" description="JS-React-Example landing page" />
		</MainLayout>
	);
}
