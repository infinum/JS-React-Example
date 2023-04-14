import { Box, BoxProps } from '@chakra-ui/react';
import { FC } from 'react';

export const Board: FC<BoxProps> = (props) => {
	return (
		<Box
			sx={{
				backgroundColor: '#ffffff',
				opacity: 1,
				backgroundImage:
					'linear-gradient(#c9c9c9 2px, transparent 2px), linear-gradient(90deg, #c9c9c9 2px, transparent 2px), linear-gradient(#c9c9c9 1px, transparent 1px), linear-gradient(90deg, #c9c9c9 1px, #ffffff 1px)',
				backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
				backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px',
			}}
			{...props}
		/>
	);
};
