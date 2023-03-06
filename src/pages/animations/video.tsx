import { NextPage } from 'next';
import { Box } from '@chakra-ui/react';
import { Board } from '@/components/features/animations/Board/Board';

const RiveAnimationPage: NextPage = () => {
	return (
		<Board w="100vw" h="100vh">
			<Box boxSize={300}>
				<video width="100%" height="100%" autoPlay loop muted playsInline>
					{/* <source
    src="https://rotato.netlify.app/alpha-demo/movie-hevc.mov"
    type='video/mp4; codecs="hvc1"'> */}
					<source src="/animations/video/bloodbourne.webm" type="video/webm" />
				</video>
			</Box>
		</Board>
	);
};

export default RiveAnimationPage;
