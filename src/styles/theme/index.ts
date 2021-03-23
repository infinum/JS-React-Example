import { extendTheme } from '@chakra-ui/react';

import { styles } from './styles';
import { colors } from './foundations/colors';
import { Container } from './components/container';

const overrides = {
	styles,
	colors,
	fonts: {
		body: 'GT Haptik',
		heading: 'GT Haptik',
	},
	sizes: {
		s: '400px',
		m: '560px',
		l: '800px',
	},
	components: {
		Container,
	},
};

const theme = extendTheme(overrides);

export default theme;
