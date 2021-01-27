import { chakra } from '@chakra-ui/react';

export const Wrapper = chakra('div', {
	baseStyle: {
		zIndex: 90000,
		position: 'fixed',
		top: 2,
		right: 2,
		minW: 100,
		boxShadow: 'md',
		bg: 'rgba(255,255,255,0.4)',
		backdropFilter: 'blur(10px)',
		borderRadius: '10px',
		border: '1px solid rgba(255,255,255,0.2)',
	},
});

export const CacheKeyWrapper = chakra('div', {
	baseStyle: {
		p: 2,
		bg: 'rgba(255,255,255,0.1)',
		borderRadius: '10px',
		border: '1px solid rgba(255,255,255,0.2)',
		boxShadow: 'md',
	},
});
