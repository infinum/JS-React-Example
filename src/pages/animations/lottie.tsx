import { Board } from '@/components/features/animations/Board/Board';
import { Box } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import { NextPage } from 'next';
import number1 from '../../../public/animations/lottie/number1.json';

const style = {
	width: '100%',
	height: '100%',
};

const LottiePage: NextPage = () => {
	return (
		<Board w="100vw" h="100vh">
			<Box boxSize={300}>
				<Lottie animationData={number1} style={style} />;
			</Box>
		</Board>
	);
};

export default LottiePage;
