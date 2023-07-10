import { useState } from 'react';
import { NextPage } from 'next';
import Rive from '@rive-app/react-canvas';
import { Box, Button, ButtonGroup } from '@chakra-ui/react';
import { Board } from '@/components/features/animations/Board/Board';

const artboards = ['Art1', 'Art2', 'Art3'];

const RiveAnimationPage: NextPage = () => {
	// disabled since this is a test scenario
	// eslint-disable-next-line @infinum/no-hooks-in-pages-folder
	const [selectedArtboard, setSelectedArtboard] = useState(artboards[0]);

	return (
		<Board w="100vw" h="100vh">
			<ButtonGroup>
				{artboards.map((artboard) => (
					<Button
						key={artboard}
						colorScheme="blue"
						isActive={selectedArtboard === artboard}
						onClick={() => setSelectedArtboard(artboard)}
					>
						{artboard}
					</Button>
				))}
			</ButtonGroup>
			<Box boxSize={300}>
				<Rive
					key={selectedArtboard}
					src="/animations/rive/bloodbourne.riv"
					artboard={selectedArtboard}
					animations={['A1', 'B1', 'C1']}
				/>
			</Box>
		</Board>
	);
};

export default RiveAnimationPage;
