import React, { FC } from 'react';
import { Heading, Stat, StatNumber, StatHelpText, Flex } from '@chakra-ui/react';
import { format } from 'date-fns';

import { Flight } from '@/resources/Flight';

interface IFlightCardProps {
	flight: Flight;
}

export const FlightCard: FC<IFlightCardProps> = ({ flight, ...rest }) => (
	<Flex p={5} shadow="md" borderWidth="1px" align="center" {...rest}>
		<Heading as="h2" size="lg" mb={2} w="50%">
			{flight.name}
		</Heading>
		<Stat w="50%" align="right">
			<StatNumber>${flight.currentSeatPrice}</StatNumber>
			<StatHelpText>
				{format(new Date(flight.departsAt), 'MMM dd')} - {format(new Date(flight.arrivesAt), 'MMM dd')}
			</StatHelpText>
		</Stat>
	</Flex>
);
