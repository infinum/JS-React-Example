import { chakra } from '@chakra-ui/react';
import React, { FC } from 'react';

export const AdminLayout: FC = ({ children }) => {
	return (
		<chakra.div bgGradient="linear(to-l, #7928CA, #FF0080)" minH="100vh">
			{children}
		</chakra.div>
	);
};
