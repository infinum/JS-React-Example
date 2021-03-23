import { mode } from '@chakra-ui/theme-tools';

export const styles = {
	global: (props) => ({
		'*': {
			boxSizing: 'border-box',
		},
		'html, body': {
			bg: mode('white', 'black')(props),
			color: mode('black', 'white')(props),
		},
	}),
};
