import { chakra } from '@chakra-ui/core';
import React, { FC } from 'react';
import { Navigation } from '../../ui/organisms/Navigation/Navigation';

export const MainLayout: FC = ({ children }) => {
	return (
		<chakra.div>
			<Navigation />
			{children}
		</chakra.div>
	);
};
