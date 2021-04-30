import React, { FC } from 'react';
import { Container, Divider, Heading, Text } from '@chakra-ui/react';
import { useResource } from '@datx/jsonapi-react';
import { useRouter } from 'next/dist/client/router';

import { LoadingMessage } from '@/components/shared/messages/LoadingMessage/LoadingMessage';
import { Todo } from '@/resources/Todo';

export const TodoShowSection: FC = () => {
	const router = useRouter();
	const { data, error } = useResource(() => [Todo, router.query.id as string]);

	if (error) {
		throw { statusCode: 404 };
	}

	if (!data) {
		return <LoadingMessage />;
	}

	return (
		<Container>
			<Heading my={10}>{data.title}</Heading>
			<Divider mb={10} />
			<Text>{data.body}</Text>
		</Container>
	);
};
