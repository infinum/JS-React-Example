import { Button, ButtonGroup, Flex, Image, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import NextLink from 'next/link';

const AnimationPage: NextPage = () => {
	return (
		<Flex align="center" justify="center" w="100vw" h="100vh">
			<ButtonGroup>
				<Button as={NextLink} p={'16'} href="/animations/rive" size="lg" variant="outline">
					<Flex align="center" justify="center" direction="column" gap={2}>
						<Image src="https://logosandtypes.com/wp-content/uploads/2021/04/rive.svg" />
						<Text as="span">Rive</Text>
					</Flex>
				</Button>
				<Button p={'16'} isDisabled size="lg" variant="outline">
					<Flex align="center" justify="center" direction="column" gap={2}>
						<Text as="span">Lottie</Text>
					</Flex>
				</Button>
				<Button p={'16'} isDisabled size="lg" variant="outline">
					<Flex align="center" justify="center" direction="column" gap={2}>
						<Text as="span">Video</Text>
					</Flex>
				</Button>
			</ButtonGroup>
		</Flex>
	);
};

export default AnimationPage;
