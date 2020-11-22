import { chakra } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Footer } from '@organisms/Footer/Footer';
import { Navigation } from '@organisms/Navigation/Navigation';

export const MainLayout: FC = ({ children }) => {
	return (
		<chakra.div>
			<Navigation />
			{children}
			<Footer />
		</chakra.div>
	);
};
