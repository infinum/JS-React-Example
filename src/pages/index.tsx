import React from 'react';
import { NextPage } from 'next';

import { MainLayout } from '@/components/shared/layouts/MainLayout/MainLayout';
import { FlightListSection } from '@/components/pages/home/FlightListSection/FlightListSection';
import { useSession } from '@/hooks/useSession';

const Home: NextPage = () => {
	useSession({ redirectTo: '/login' });

	return (
		<MainLayout>
			<FlightListSection />
		</MainLayout>
	);
};

export default Home;
