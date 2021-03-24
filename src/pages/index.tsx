import { NextPage } from 'next';
import React, { ReactElement } from 'react';
import { Container, Heading } from '@chakra-ui/react';

import { Meta } from '@/components/utilities/Meta/Meta';
import { Navigation } from '@/components/shared/Navigation/Navigation';

const Home: NextPage = () => {
	return (
		<>
			<Meta />
			<Navigation />
			<Container>
				<section>
					<Heading>Infinum todo list</Heading>
				</section>
			</Container>
		</>
	);
};

export default Home;
