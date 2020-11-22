import { ChakraProvider, useColorMode, useColorModeValue, Flex, IconButton } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import * as React from 'react';
import { withPerformance } from 'storybook-addon-performance';

import theme from '../src/styles/themes/default';

const ColorModeToggleBar = () => {
	const { toggleColorMode } = useColorMode();
	const SwitchIcon = useColorModeValue(FaMoon, FaSun);
	const nextMode = useColorModeValue('dark', 'light');

	return (
		<Flex justify="flex-end" mb={4}>
			<IconButton
				size="md"
				fontSize="lg"
				aria-label={`Switch to ${nextMode} mode`}
				variant="ghost"
				color="current"
				marginLeft="2"
				onClick={toggleColorMode}
				icon={<SwitchIcon />}
			/>
		</Flex>
	);
};

const withChakra = (StoryFn: Function) => (
	<ChakraProvider theme={theme}>
		<div id="story-wrapper" style={{ minHeight: '100vh' }}>
			{/* <ColorModeToggleBar /> */}
			<StoryFn />
		</div>
	</ChakraProvider>
);

export const decorators = [withChakra, withPerformance];
