import React, { FC } from 'react';
import { Box, BoxProps, css } from '@chakra-ui/react';
import { GlobalStyles } from '@/components/shared/utilities/GlobalStyles/GlobalStyles';

export const AuthLayout: FC<BoxProps> = ({ children }) => {
	return (
		<Box minH="full">
			<GlobalStyles
				styles={{
					body: {
						_dark: { bg: 'gray.900' },
						_light: { bg: 'gray.200' },
					},
				}}
			/>
			{children}
		</Box>
	);
};
