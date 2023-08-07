import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { HomeHeaderSection } from '@/components/features/home/HomeHeaderSection/HomeHeaderSection';
import { MainLayout } from '@/components/shared/layouts/MainLayout/MainLayout';
import { createClient } from '@/datx/create-client';
import { getSafeLocale } from '@/utils/locale';
import { Hydrate } from '@datx/swr';

export type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Home: NextPage<HomeProps> = ({ fallback }) => {
	return (
		<Hydrate fallback={fallback}>
			<MainLayout>
				<HomeHeaderSection />
			</MainLayout>
		</Hydrate>
	);
};

export const getServerSideProps = async ({ locale }: GetServerSidePropsContext) => {
	const client = createClient();

	const { fallback } = client;

	return {
		props: {
			...(await serverSideTranslations(getSafeLocale(locale), ['common', 'main-navigation'])),
			fallback,
		},
	};
};

export default Home;
