import React, { FC } from 'react';
import { Container, Text } from '@chakra-ui/react';

import { FooterWrapper } from './MainFooter.elements';

export const MainFooter: FC = () => {
	return (
		<FooterWrapper>
			<Container>
				<Text textAlign="center">© 2021 Infinum Inc.</Text>
			</Container>
		</FooterWrapper>
	);
};
