import { mode } from '@chakra-ui/theme-tools';

export const styles = {
	global: (props) => ({
		'*': {
			boxSizing: 'border-box',
		},
		'html, body, #__next': {
			bg: mode('white', 'dark')(props),
			color: mode('dark', 'white')(props),
			width: '100%',
			height: '100%',
		},
	}),
};
