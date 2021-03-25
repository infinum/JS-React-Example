import React, { FC } from 'react';
import { Center, CenterProps, Image, Text } from '@chakra-ui/react';

export const Loading: FC<CenterProps> = (props) => (
	<Center height="100%" {...props}>
		<Image src="/images/logo-infinum.png" alt="presentation" width="240px" />
		<Text ml={10} fontSize="3xl" color="red">
			Loading...
		</Text>
	</Center>
);
