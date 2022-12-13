import { extendTheme } from '@chakra-ui/react';
import localFont from '@next/font/local';

import { styles } from './styles';

import { colors } from './foundations/colors';
// -- PLOP:IMPORT_FOUNDATION_THEME --

// -- PLOP:IMPORT_COMPONENT_THEME --

// A fix for Chakra UI CLI pass on npm postinstall.
// It will be replaced with Next.js localFont in _app.tsx.
const fontFamilyFallback = 'system-ui, sans-serif';

const overrides = {
	styles,
	colors,
	fonts: {
		body: fontFamilyFallback,
		heading: fontFamilyFallback,
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
