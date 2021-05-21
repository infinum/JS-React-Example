import React, { FC } from 'react';
import { Box, Text, Button, IconButton, Heading } from '@chakra-ui/react';
import NextLink from 'next/link';

import { Flight } from '@/resources/Flight';

import EditIcon from '@/assets/icons/ic-edit.svg';

interface IFlightCardProps {
	flight: Flight;
}

export const FlightCard: FC<IFlightCardProps> = ({ flight, ...rest }) => (
	<Box p={5} shadow="md" borderWidth="1px" {...rest}>
		<Heading as="h2" size="lg" mb={2}>
			{flight.name}
		</Heading>
		{/* <Text fontSize="xl" mb={8} whiteSpace="pre-line">
			{todo.body}
		</Text>
		<NextLink href="/todo/[id]" as={`/todo/${todo.id}`} passHref>
			<Button mr={6} as="a">
				Preview
			</Button>
		</NextLink>
		<NextLink href="/todo/[id]/edit" as={`/todo/${todo.id}/edit`} passHref>
			<IconButton aria-label="Search database" icon={<EditIcon width="24px" />} />
		</NextLink> */}
	</Box>
);
