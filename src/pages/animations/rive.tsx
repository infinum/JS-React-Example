import { NextPage } from 'next';
import Rive from '@rive-app/react-canvas';
import { Box } from '@chakra-ui/react';

const RiveAnimationPage: NextPage = () => {
	return (
		<Box boxSize={300}>
			<Rive src="/animations/rive/bloodbourne_sample.riv" />
		</Box>
	);
};

export default RiveAnimationPage;
