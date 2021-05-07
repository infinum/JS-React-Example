import React, { FC, Fragment } from 'react';
import { Box, Container, Divider, Heading, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useResourceList } from '@datx/jsonapi-react';

import { Todo } from '@/resources/Todo';
import { TodoList } from '@/components/shared/todo/TodoList/TodoList';
import { LoadingMessage } from '@/components/shared/messages/LoadingMessage/LoadingMessage';
import { EmptyListMessage } from '@/components/shared/messages/EmptyListMessage/EmptyListMessage';

import PlusIcon from '@/assets/icons/ic-plus.svg';
import { BasicPagination } from '@/components/shared/paginations/BasicPagination/BasicPagination';

export const TodoListSection: FC = () => {
	const { data, error, meta, hasNext, hasPrev } = useResourceList(() => [
		Todo,
		{
			queryParams: {
				custom: [
					{ key: 'page[size]', value: '3' },
					{ key: 'page[number]', value: '1' },
				],
			},
		},
	]);

	if (error) {
		throw { statusCode: 404 };
	}

	if (!data) {
		return <LoadingMessage />;
	}

	return (
		<Container>
			<Box as="section">
				<Heading as="h1" my={10}>
					Infinum todo list
					<NextLink href="/todo/new/edit" passHref>
						<IconButton ml={8} aria-label="Create new todo" icon={<Box width="16px" as={PlusIcon} />} />
					</NextLink>
				</Heading>

				<Divider mb={10} />
				{data.length > 0 ? (
					<Fragment>
						<TodoList todoList={data} />
						<BasicPagination hasNext={hasNext} hasPrev={hasPrev} />
					</Fragment>
				) : (
					<EmptyListMessage />
				)}
			</Box>
		</Container>
	);
};
