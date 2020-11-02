import { Flex, FormControl, FormControlProps, FormLabel, Switch, useColorMode } from '@chakra-ui/core';
import React, { FC } from 'react';

export const ColorModeSwitch: FC<FormControlProps> = (props) => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<FormControl as={Flex} justifyContent="center" alignItems="center" {...props}>
			<Switch size="lg" colorScheme="orange" isChecked={colorMode !== 'light'} onChange={toggleColorMode} />
			<FormLabel ml="2" mb={0} color="gray.500">
				Turn me {colorMode === 'light' ? 'dark' : 'light'}
			</FormLabel>
		</FormControl>
	);
};
