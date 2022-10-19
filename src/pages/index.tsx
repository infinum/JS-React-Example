import React from 'react';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { MainLayout } from '@/components/shared/layouts/MainLayout/MainLayout';
import { Hydrate } from '@datx/swr';
import { createClient } from '@/datx/create-client';
import { HomeHeaderSection } from '@/components/features/home/HomeHeaderSection/HomeHeaderSection';
import { query } from '@/libs/query';

const QUERY = query((q) => q.findRecords('user').filter({ attribute: 'name', value: 'John' }));

console.log(QUERY);

type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Home: NextPage<HomeProps> = ({ fallback }) => {
	return (
		<Hydrate fallback={fallback}>
			<MainLayout>
				<HomeHeaderSection />
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
