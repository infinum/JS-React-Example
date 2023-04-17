import { FC, Fragment, useMemo } from 'react';
import { useSession } from '@/hooks/use-session';
import { useDatx } from '@datx/swr';
import { getFlightsQuery } from '@/queries/flights';
import { EmptyListMessage } from '@/components/shared/messages/EmptyListMessage/EmptyListMessage';
import { FlightList, FlightListFallback } from '@/components/shared/flight/FlightList/FlightList';
import { BasicPagination, getPagination } from '@/components/shared/paginations/BasicPagination/BasicPagination';
import { useRouter } from 'next/router';

export interface IFlightsProps {}

export const Flights: FC<IFlightsProps> = () => {
	const { query } = useRouter();
	const { data: sessionResponse } = useSession();
	const user = sessionResponse?.data.user;
	const { data, error } = useDatx(() => getFlightsQuery(user, query.page as string));
	const pagination = useMemo(() => getPagination(data), [data]);

	if (error) {
		return <div>error</div>;
	}

	if (!data) {
		return <FlightListFallback />;
	}

	if (data.data.length === 0) {
		return <EmptyListMessage />;
	}

	return (
		<Fragment>
			<FlightList flightList={data.data} />
			<BasicPagination pagination={pagination} />
		</Fragment>
	);
};
