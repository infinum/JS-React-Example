import { createFetcher, DatxProvider, useInitialize } from '@datx/swr';
import { Story, StoryContext } from '@storybook/react';
import { SWRConfig } from 'swr';

import { createClient } from '../src/datx/create-client';

export const withDatxProvider = (StoryFn: Story, context: StoryContext) => {
	const client = useInitialize(createClient);

	return (
		<DatxProvider client={client}>
			<SWRConfig value={{ fetcher: createFetcher(client), provider: () => new Map() }}>
				<StoryFn />
			</SWRConfig>
		</DatxProvider>
	);
};
