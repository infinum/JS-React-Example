import { ReactElement, Suspense } from 'react';

import { Seo } from '@organisms/Seo/Seo';
import { AdminLayout } from '@components/layouts/AdminLayout/AdminLayout';
import { Books, BookFallback } from '@components/ui/organisms/Books/Books';
import { isServer } from '../../utils/env';

export default function Dashboard(): ReactElement {
	return (
		<AdminLayout>
			<Seo title="Dashboard Page" description="JS-React-Example dashboard page" />
			{!isServer ? (
				<Suspense fallback={<BookFallback />}>
					<Books />
				</Suspense>
			) : null}
		</AdminLayout>
	);
}
