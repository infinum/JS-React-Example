import React, { FC, Fragment } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { FlightList } from '@/components/shared/flight/FlightList/FlightList';
import { EmptyListMessage } from '@/components/shared/messages/EmptyListMessage/EmptyListMessage';
import { Flight } from '@/models/Flight';
import { useSession } from '@/hooks/use-session';
import { useDatx } from '@datx/swr';
import { useTranslation } from 'next-i18next';

export const FlightListSection: FC = () => {
	const { t } = useTranslation(['flight-list-section']);
	const { data: sessionResponse } = useSession();
	const user = sessionResponse?.data.user;

	const { data, error } = useDatx(() =>
		user
			? ({
					op: 'getMany',
					type: Flight.type,
			  } as const)
			: null
	);

	return (
		<Container py={10} size="xl">
			<Box as="section">
				<Heading as="h1" mb={3} size="lg">
					{t('flight-list-section:title')}
				</Heading>

				{error && <div>Failed to load</div>}

				{data && data.data.length > 0 ? (
					<Fragment>
						<FlightList flightList={data.data} />
						{/* <BasicPagination hasNext={hasNext} hasPrev={hasPrev} onNext={next} onPrev={prev} current={1} total={10} /> */}
					</Fragment>
				) : (
					<EmptyListMessage />
				)}
			</Box>
		</Container>
	);
};
