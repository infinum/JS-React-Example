import React, { FC } from 'react';
import { Heading, Stat, StatNumber, StatHelpText, Flex } from '@chakra-ui/react';
import { format } from 'date-fns';

import { Flight } from '@/resources/Flight';

interface IFlightCardProps {
	flight: Flight;
}

export const FlightCard: FC<IFlightCardProps> = ({ flight, ...rest }) => (
	<Flex align="center" p={5} borderWidth="1px" shadow="md" {...rest}>
		<Heading as="h2" w="50%" mb={2} size="lg">
			{flight.name}
		</Heading>
		<Stat w="50%">
			<StatNumber>${flight.currentSeatPrice}</StatNumber>
			<StatHelpText>
				{format(new Date(flight.departsAt), 'MMM dd')} - {format(new Date(flight.arrivesAt), 'MMM dd')}
			</StatHelpText>
		</Stat>
	</Flex>
);
