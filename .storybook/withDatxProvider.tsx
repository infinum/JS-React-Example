import { Story, StoryContext } from '@storybook/react';
import React from 'react';
import { cache } from 'swr';

import { DatxProvider } from '../src/libs/@datx/jsonapi-react';
import client from '../src/store';

export const withDatxProvider = (StoryFn: Story, context: StoryContext) => {
	cache.clear();

	return (
		<DatxProvider client={client}>
			<StoryFn />
		</DatxProvider>
	);
};
