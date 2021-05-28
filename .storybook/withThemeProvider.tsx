import { ChakraProvider } from '@chakra-ui/react';
import { Story, StoryContext } from '@storybook/react';
import React from 'react';

import { Fonts } from '../src/styles/Fonts';
import theme from '../src/styles/theme';

const themes = {
	default: theme,
};

export const withThemeProvider = (StoryFn: Story, context: StoryContext) => {
	const theme = themes[context.globals.theme];

	return (
		<ChakraProvider theme={theme}>
			<Fonts />
			<StoryFn {...context} />
		</ChakraProvider>
	);
};
