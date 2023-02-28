import { extendTheme } from '@chakra-ui/react';
import localFont from '@next/font/local';

// -- PLOP:IMPORT_FOUNDATION_THEME --

import { containerTheme as Container } from './components/container';
// -- PLOP:IMPORT_COMPONENT_THEME --

// A fix for Chakra UI CLI pass on npm postinstall.
// It will be replaced with Next.js localFont in _app.tsx.
const fontFamilyFallback = 'system-ui, sans-serif';

const overrides = {
	fonts: {
		body: fontFamilyFallback,
		heading: fontFamilyFallback,
	},
	// -- PLOP:REGISTER_FOUNDATION_THEME --
	components: {
		Container,
		// -- PLOP:REGISTER_COMPONENT_THEME --
	},
};

const theme = extendTheme(overrides);

export default theme;
