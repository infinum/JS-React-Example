import { Theme, extendTheme } from '@chakra-ui/react';

import { styles } from './styles';

import { colors } from './foundations/colors';
// -- PLOP:IMPORT_FOUNDATION_THEME --

import { containerTheme as Container } from './components/container';
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
		Container,
		// -- PLOP:REGISTER_COMPONENT_THEME --
	},
};

const theme = extendTheme(overrides) as typeof overrides & Theme;

export default theme;
