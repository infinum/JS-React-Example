import { extendTheme } from '@chakra-ui/core';

// Global style overrides
import styles from './styles';

// Foundational style overrides
import borders from './foundations/borders';

// Component style overrides
import Button from './components/button';
import Card from './components/card';

const overrides = {
	styles,
	borders,
	// Other foundational style overrides go here
	components: {
		Button,
		Card,
		// Other components go here
	},
};

const theme = extendTheme(overrides);

export const Theme = typeof theme;

export default theme;
