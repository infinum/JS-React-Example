import { ReactElement, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Seo } from '@organisms/Seo/Seo';
import { AdminLayout } from '@components/layouts/AdminLayout/AdminLayout';
import { Books, BooksSkeleton } from '@components/ui/organisms/Books/Books';
import { isServer } from '../../utils/env';

export default function Dashboard(): ReactElement {
	return (
		<AdminLayout>
			<Seo title="Dashboard Page" description="JS-React-Example dashboard page" />
			{!isServer ? (
				<Suspense fallback={<BooksSkeleton />}>
					<ErrorBoundary fallback={<div>Oh no</div>}>
						<Books />
					</ErrorBoundary>
				</Suspense>
			) : null}
		</AdminLayout>
	);
}
