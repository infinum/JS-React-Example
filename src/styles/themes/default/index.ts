import { extendTheme } from '@chakra-ui/react';

// Global style overrides
import styles from './styles';

// Foundational style overrides
import borders from './foundations/borders';
import colors from './foundations/colors';

// Component style overrides
// [hygen_inject - component imports]
import NavLink from './components/nav-link';

import Button from './components/button';
import Card from './components/card';
import Section from './components/section';

const overrides = {
	styles,
	borders,
	colors,
	// Other foundational style overrides go here
	components: {
		// [hygen_inject - component registration]
    NavLink,

		Button,
		Card,
		Section,
	},
};

const theme = extendTheme(overrides);

export const Theme = typeof theme;

export default theme;
