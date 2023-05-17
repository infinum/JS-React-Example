import { FC } from 'react';
import Lottie from 'lottie-react';
import number1 from '../../../public/animations/lottie/number1.json';
import { Board } from '@/components/features/animations/Board/Board';
import { Box, BoxProps } from '@chakra-ui/react';

const style = {
	width: '100%',
	height: '100%',
};

const LottiePage: FC<BoxProps> = (props) => {
	return (
		<Board w="100vw" h="100vh" {...props}>
			<Box boxSize={300}>
				<Lottie animationData={number1} style={style} />;
			</Box>
		</Board>
	);
};

export default LottiePage;
