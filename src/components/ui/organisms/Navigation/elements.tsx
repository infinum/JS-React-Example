import { chakra } from '@chakra-ui/react';

export const NavigationContainer = chakra('div', {
	baseStyle: {
		bg: 'whiteAlpha.900',
		backdropFilter: 'saturate(180%) blur(5px)',
		borderBottom: '1px solid',
		borderBottomColor: 'gray.200',
		position: 'fixed',
		width: '100%',
		top: 0,
		zIndex: 20000,
		transition: 'transform 0.2s',
	},
});
