import { GlobalStyles } from '@/components/shared/utilities/GlobalStyles/GlobalStyles';
import { Box, BoxProps } from '@chakra-ui/react';
import { FC } from 'react';

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
