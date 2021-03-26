import React from 'react';
import { NextPage } from 'next';
import { Container } from '@chakra-ui/react';
import { useResourceList } from '@datx/jsonapi-react';

import { Meta } from '@/components/utilities/Meta/Meta';
import { Navigation } from '@/components/shared/Navigation/Navigation';
import { Loading } from '@/components/shared/Loading/Loading';
import { TodoPreview } from '@/components/Home/TodoPreview/TodoPreview';
import { Todo } from '@/models/Todo';

const Home: NextPage = () => {
	const { data, error } = useResourceList(() => [Todo]);

	if (error) {
		throw { statusCode: 404 };
	}

	if (!data) {
		return <Loading />;
	}

	return (
		<>
			<Meta />
			<Navigation />
			<Container>
				<TodoPreview todoList={data} />
			</Container>
		</>
	);
};

export default Home;
