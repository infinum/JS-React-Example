import React, { FC } from 'react';
import { StackProps, VStack } from '@chakra-ui/react';

import { FlightCard } from '@/components/shared/flight/FlightCard/FlightCard';
import { Flight } from '@/resources/Flight';

interface IFlightListProps extends StackProps {
	flightList: Array<Flight>;
}

export const FlightList: FC<IFlightListProps> = ({ flightList, ...rest }) => {
	return (
		<VStack spacing={4} align="stretch" {...rest}>
			{flightList.map((item) => (
				<FlightCard key={item.id} flight={item} />
			))}
		</VStack>
	);
};
