import React from 'react';
import { NextPage } from 'next';

import { MainLayout } from '@/components/shared/layouts/MainLayout/MainLayout';
import { FlightListSection } from '@/components/pages/home/FlightListSection/FlightListSection';
import { useSession } from '@/hooks/useSession';

const Home: NextPage = () => {
	const { user } = useSession({ redirectTo: '/login' });

	if (!user) {
		return <div>loading</div>;
	}

	return (
		<MainLayout>
			<FlightListSection />
		</MainLayout>
	);
};

export default Home;
