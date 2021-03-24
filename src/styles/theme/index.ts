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
		sm: '400px',
		md: '560px',
		lg: '800px',
	},
	components: {
		Container,
	},
};

const theme = extendTheme(overrides);

export default theme;
