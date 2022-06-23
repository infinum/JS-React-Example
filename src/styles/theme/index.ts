import { extendTheme } from '@chakra-ui/react';

import { styles } from './styles';
import { colors } from './foundations/colors';
import { Container } from './components/container';
import { Heading } from './components/heading';

const overrides = {
	styles,
	colors,
	fonts: {
		body: 'GT Haptik',
		heading: 'GT Haptik',
	},
	components: {
		Container,
		Heading,
	},
	semanticTokens: {
		colors: {
			'bg-surface': {
				default: 'white',
				_dark: 'gray.800',
			},
		},
	},
};

const theme = extendTheme(overrides);

export default theme;
