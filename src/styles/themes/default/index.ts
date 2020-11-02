import { extendTheme } from '@chakra-ui/core';

// Global style overrides
import styles from './styles';

// Foundational style overrides
import borders from './foundations/borders';
import colors from './foundations/colors';

// Component style overrides
import Button from './components/button';
import Card from './components/card';
import Section from './components/section';

const overrides = {
	styles,
	borders,
	colors,
	// Other foundational style overrides go here
	components: {
		Button,
		Card,
		Section,
		// Other components go here
	},
};

const theme = extendTheme(overrides);

export const Theme = typeof theme;

export default theme;
