import { chakra } from '@chakra-ui/react';
import React, { FC } from 'react';

export const DashboardLayout: FC = ({ children }) => {
	return <chakra.div>{children}</chakra.div>;
};
