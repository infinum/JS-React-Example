import React, { ReactElement } from 'react';
import { Heading } from '@chakra-ui/react';

import { Head } from '@shared/Head/Head';

function Home(): ReactElement {
	return (
		<>
			<Head />
			<section>
				<Heading>Infinum todo list</Heading>
			</section>
		</>
	);
}

export default Home;
