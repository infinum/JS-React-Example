import React from 'react';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { MainLayout } from '@/components/shared/layouts/MainLayout/MainLayout';
import { FlightListSection } from '@/components/features/flights/FlightListSection/FlightListSection';
import { Hydrate } from '@datx/swr';
import { createClient } from '@/datx/create-client';

type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Home: NextPage<HomeProps> = ({ fallback }) => {
	return (
		<Hydrate fallback={fallback}>
			<MainLayout>
				<FlightListSection />
			</MainLayout>
		</Hydrate>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
	const client = createClient();

	const { fallback } = client;

	return {
		props: {
			...(await serverSideTranslations(String(locale), ['common', 'main-navigation'])),
			fallback,
		},
	};
};

export default Home;
