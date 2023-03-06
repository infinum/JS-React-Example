import { NextPage } from 'next';
import Rive from '@rive-app/react-canvas';
import { Box } from '@chakra-ui/react';
import { Board } from '@/components/features/animations/Board/Board';

const RiveAnimationPage: NextPage = () => {
	return (
		<Board w="100vw" h="100vh">
			<Box boxSize={300}>
				<Rive src="/animations/rive/bloodbourne.riv" animations="C1" />
			</Box>
		</Board>
	);
};

export default RiveAnimationPage;