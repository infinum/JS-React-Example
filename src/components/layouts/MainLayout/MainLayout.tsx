import { chakra } from '@chakra-ui/core';
import React, { FC } from 'react';
import { Footer } from '@ui/organisms/Footer/Footer';
import { Navigation } from '@ui/organisms/Navigation/Navigation';

export const MainLayout: FC = ({ children }) => {
	return (
		<chakra.div>
			<Navigation />
			{children}
			<Footer />
		</chakra.div>
	);
};
