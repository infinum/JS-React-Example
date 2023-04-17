import { FC } from 'react';
import { StackProps, VStack } from '@chakra-ui/react';

import { FlightCard, FlightCardFallback } from '@/components/shared/flight/FlightCard/FlightCard';
import { Flight } from '@/models/Flight';

export interface IFlightListProps extends StackProps {
	flightList: Array<Flight>;
}

export const FlightList: FC<IFlightListProps> = ({ flightList, ...rest }) => {
	return (
		<VStack align="stretch" spacing={4} {...rest}>
			{flightList.map((item) => (
				<FlightCard key={item.id} flight={item} />
			))}
		</VStack>
	);
};

export interface IFlightListFallbackProps extends StackProps {
	pageSize?: number;
}

export const FlightListFallback: FC<IFlightListFallbackProps> = ({ pageSize = 10 }) => {
	return (
		<VStack align="stretch" spacing={4}>
			{Array.from({ length: pageSize }).map((_, index) => (
				<FlightCardFallback key={index} />
			))}
		</VStack>
	);
};
