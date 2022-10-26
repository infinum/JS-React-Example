import { extendTheme } from '@chakra-ui/react';

// -- PLOP:IMPORT_FOUNDATION_THEME --

// -- PLOP:IMPORT_COMPONENT_THEME --

const overrides = {
	// -- PLOP:REGISTER_FOUNDATION_THEME --
	components: {
		// -- PLOP:REGISTER_COMPONENT_THEME --
	},
};

const theme = extendTheme(overrides);

export default theme;
