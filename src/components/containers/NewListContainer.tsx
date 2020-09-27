import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';

import { NewListForm } from 'components/ui/NewListForm';
import { createNewList } from 'utils/fetchers';

export const NewListContainer = (): ReactElement => {
	const router = useRouter();
	const [apiErrors, setApiErrors] = useState<string>();

	const onSubmit = async ({ title }: { title: string }): Promise<void> => {
		try {
			const response = await createNewList.fetch(null, { title, done: false });
			setApiErrors(null);
			router.push(`/${response.data.uuid}`);
		} catch (e) {
			setApiErrors(e.error?.message);
		}
	};

	return <NewListForm onSubmit={onSubmit} apiErrors={apiErrors} />;
};
