import { extendTheme } from '@chakra-ui/react';

import { colors } from './foundations/colors';
import { Container } from './components/container';

const overrides = {
	colors,
	fonts: {
		body: 'GT Haptik',
		heading: 'GT Haptik',
	},
	components: {
		Container,
	},
};

const theme = extendTheme(overrides);

export default theme;
