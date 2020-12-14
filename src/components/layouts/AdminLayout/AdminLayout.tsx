import { chakra } from '@chakra-ui/react';
import React, { FC } from 'react';

export const AdminLayout: FC = ({ children }) => {
	return <chakra.div>{children}</chakra.div>;
};
