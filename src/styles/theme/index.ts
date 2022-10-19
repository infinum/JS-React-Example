import { extendTheme } from '@chakra-ui/react';

import { styles } from './styles';
import { colors } from './foundations/colors';

// -- PLOP:IMPORT_FOUNDATION_THEME --

// -- PLOP:IMPORT_COMPONENT_THEME --

const overrides = {
	styles,
	colors,
	fonts: {
		body: 'GT Haptik',
		heading: 'GT Haptik',
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
