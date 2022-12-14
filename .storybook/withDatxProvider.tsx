import React from 'react';
import { createFetcher, DatxProvider, useInitialize } from '@datx/swr';
import { StoryFn, StoryContext } from '@storybook/react';
import { SWRConfig } from 'swr';

import { createClient } from '../src/datx/create-client';

export const withDatxProvider = (StoryFn: StoryFn, context: StoryContext) => {
	const client = useInitialize(createClient);

	return (
		<DatxProvider client={client}>
			<SWRConfig value={{ fetcher: createFetcher(client), provider: () => new Map() }}>
				<StoryFn />
			</SWRConfig>
		</DatxProvider>
	);
};
