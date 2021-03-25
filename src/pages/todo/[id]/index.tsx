import React from 'react';
import { NextPage } from 'next';
import { Container, Text } from '@chakra-ui/react';
import { useResource } from '@datx/jsonapi-react';
import { useRouter } from 'next/dist/client/router';

import { Loading } from '@/components/shared/Loading/Loading';
import { Navigation } from '@/components/shared/Navigation/Navigation';
import { Meta } from '@/components/utilities/Meta/Meta';
import { Todo } from '@/models/Todo';

const SingleTodo: NextPage = () => {
	const router = useRouter();
	const { data, error } = useResource([Todo, router.query?.id as string]);

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
			<Container py={12}>
				<section>
					<Text>{data.body}</Text>
				</section>
			</Container>
		</>
	);
};

export default SingleTodo;
