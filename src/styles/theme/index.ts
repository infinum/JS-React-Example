import { extendTheme } from '@chakra-ui/react';

import { styles } from './styles';
import { colors } from './foundations/colors';

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
};

const theme = extendTheme(overrides);

export default theme;
