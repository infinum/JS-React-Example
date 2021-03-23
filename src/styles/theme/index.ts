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
};

const theme = extendTheme(overrides);

export default theme;
