import { FC } from 'react';
import { Heading, Stat, StatNumber, StatHelpText, Flex, Skeleton, StatLabel, Text, Box } from '@chakra-ui/react';
import { format } from 'date-fns';
import { Flight } from '@/models/Flight';
import { useTranslation } from 'next-i18next';

interface IFlightCardProps {
	flight: Flight;
}

export const FlightCard: FC<IFlightCardProps> = ({ flight, ...rest }) => {
	const { t } = useTranslation('flight-card');

	return (
		<Flex align="center" p={5} borderWidth="1px" {...rest}>
			<Box w="50%" mb={2}>
				<Heading as="h2" size="lg">
					{flight.name}
				</Heading>

				{flight.company && <Text color="gray.700">by {flight.company?.name}</Text>}
			</Box>

			<Stat w="50%">
				<StatLabel srOnly>{t('seatPriceLabel')}</StatLabel>
				<StatNumber>${flight.currentSeatPrice}</StatNumber>
				<StatHelpText>
					{format(new Date(flight.departsAt), 'MMM dd')} - {format(new Date(flight.arrivesAt), 'MMM dd')}
				</StatHelpText>
			</Stat>
		</Flex>
	);
};

export const FlightCardFallback: FC = () => <Skeleton w="full" h="100px" p={5} />;
