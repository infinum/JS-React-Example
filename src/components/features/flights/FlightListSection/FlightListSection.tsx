import { FC, Fragment } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { FlightList } from '@/components/shared/flight/FlightList/FlightList';
import { LoadingMessage } from '@/components/shared/messages/LoadingMessage/LoadingMessage';
import { EmptyListMessage } from '@/components/shared/messages/EmptyListMessage/EmptyListMessage';
import { BasicPagination } from '@/components/shared/paginations/BasicPagination/BasicPagination';
import { useSession } from '@/hooks/use-session';
import { useDatx } from '@datx/swr';
import { useTranslation } from 'next-i18next';
import { flightsQuery } from '@/queries/flight';
import { getResponseRawData } from '@datx/jsonapi';

const FlightListFragment = () => {
	const { data: sessionResponse, error: sessionErrorResponse } = useSession();
	const user = sessionResponse?.data.user;

	const { data: flightsResponse, error: flightsErrorResponse } = useDatx(flightsQuery(user));

	if ((!sessionResponse && !sessionErrorResponse) || (!flightsResponse && !flightsErrorResponse)) {
		return <LoadingMessage message="Loading" />;
	}

	// if (!flightsResponse && !flightsErrorResponse) {
	// 	return <LoadingMessage message="Loading Flights" />;
	// }

	return flightsResponse && flightsResponse.data.length > 0 ? (
		<Fragment>
			<FlightList flightList={flightsResponse.data} />
			{/* <BasicPagination hasNext={hasNext} hasPrev={hasPrev} onNext={next} onPrev={prev} current={1} total={10} /> */}
		</Fragment>
	) : (
		<EmptyListMessage />
	);
};

export const FlightListSection: FC = () => {
	const { t } = useTranslation(['flight-list-section']);

	return (
		<Container py={10} size="xl">
			<Box as="section">
				<Heading as="h1" mb={3} size="lg">
					{t('flight-list-section:title')}
				</Heading>
				<FlightListFragment />
			</Box>
		</Container>
	);
};
