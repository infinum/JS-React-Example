import { mode } from '@chakra-ui/theme-tools';

export const styles = {
	global: (props) => ({
		'*': {
			boxSizing: 'border-box',
		},
		'html, body': {
			bg: mode('white', 'dark')(props),
			color: mode('dark', 'white')(props),
		},
	}),
};
