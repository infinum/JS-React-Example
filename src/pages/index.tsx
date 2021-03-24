import { NextPage } from 'next';
import React from 'react';
import { Container, Heading } from '@chakra-ui/react';
import { useDatxClient } from '@datx/jsonapi-react';

import { Meta } from '@/components/utilities/Meta/Meta';
import { Navigation } from '@/components/shared/Navigation/Navigation';

const Home: NextPage = () => {
	const client = useDatxClient();
	console.log(client);

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
