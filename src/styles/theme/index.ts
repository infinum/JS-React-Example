import localFont from '@next/font/local';
import { extendTheme } from '@chakra-ui/react';

import { styles } from './styles';

import { colors } from './foundations/colors';
// -- PLOP:IMPORT_FOUNDATION_THEME --

// -- PLOP:IMPORT_COMPONENT_THEME --

const gtHaptik = localFont({
	src: [
		{ path: '../../assets/fonts/GT-Haptik-Regular.woff', weight: '400', style: 'normal' },
		{ path: '../../assets/fonts/GT-Haptik-Bold.woff', weight: '700', style: 'normal' },
	],
});

const overrides = {
	styles,
	colors,
	fonts: {
		body: gtHaptik.style.fontFamily,
		heading: gtHaptik.style.fontFamily,
	},
	semanticTokens: {
		colors: {
			'bg-surface': {
				default: 'gray.100',
				_dark: 'gray.700',
			},
		},
	},
	// -- PLOP:REGISTER_FOUNDATION_THEME --
	components: {
		// -- PLOP:REGISTER_COMPONENT_THEME --
	},
};

const theme = extendTheme(overrides);

export default theme;
