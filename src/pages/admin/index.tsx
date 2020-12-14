import { ReactElement } from 'react';

import { Seo } from '@organisms/Seo/Seo';
import { AdminLayout } from '@components/layouts/AdminLayout/AdminLayout';
import { Books } from '@components/ui/organisms/Books/Books';

export default function Dashboard(): ReactElement {
	return (
		<AdminLayout>
			<Seo title="Dashboard Page" description="JS-React-Example dashboard page" />
			<Books />
		</AdminLayout>
	);
}
