import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { FlightListSection } from '@/components/features/flights/FlightListSection/FlightListSection';
import { MainLayout } from '@/components/shared/layouts/MainLayout/MainLayout';
import { createClient } from '@/datx/create-client';
import { getSafeLocale } from '@/utils/locale';
import { Hydrate } from '@datx/swr';
import { Flights } from '@/components/features/flights/Flights/Flights';

export type FlightsProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const FlightsPage: NextPage<FlightsProps> = ({ fallback }) => {
	return (
		<Hydrate fallback={fallback}>
			<MainLayout>
				<FlightListSection>
					<Flights />
				</FlightListSection>
			</MainLayout>
		</Hydrate>
	);
};

export const getServerSideProps = async ({ locale }: GetServerSidePropsContext) => {
	const client = createClient();

	const { fallback } = client;

	return {
		props: {
			...(await serverSideTranslations(getSafeLocale(locale), ['common', 'main-navigation', 'flight-list-section'])),
			fallback,
		},
	};
};

export default FlightsPage;
