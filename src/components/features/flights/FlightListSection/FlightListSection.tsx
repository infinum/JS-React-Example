import React, { FC, Fragment } from 'react';
import { Box, Container, Divider, Heading } from '@chakra-ui/react';
import { useResourceList } from '@datx/jsonapi-react';

import { FlightList } from '@/components/shared/flight/FlightList/FlightList';
import { LoadingMessage } from '@/components/shared/messages/LoadingMessage/LoadingMessage';
import { EmptyListMessage } from '@/components/shared/messages/EmptyListMessage/EmptyListMessage';
import { BasicPagination } from '@/components/shared/paginations/BasicPagination/BasicPagination';
import { Flight } from '@/resources/Flight';

import { useSession } from '@/hooks/useSession';

export const FlightListSection: FC = () => {
	const { user } = useSession();

	const { data, error, hasNext, hasPrev, next, prev } = useResourceList(() =>
		user
			? [
					Flight,
					{
						queryParams: {
							custom: [
								{ key: 'page[size]', value: '3' },
								{ key: 'page[number]', value: '1' },
							],
						},
					},
			  ]
			: null
	);

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
					All flights
				</Heading>

				<Divider mb={10} />
				{data.length > 0 ? (
					<Fragment>
						<FlightList flightList={data} />
						<BasicPagination hasNext={hasNext} hasPrev={hasPrev} onNext={next} onPrev={prev} current={1} total={10} />
					</Fragment>
				) : (
					<EmptyListMessage />
				)}
			</Box>
		</Container>
	);
};
