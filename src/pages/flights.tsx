import React from 'react';
import { NextPage } from 'next';

import { MainLayout } from '@/components/shared/layouts/MainLayout/MainLayout';
import { FlightListSection } from '@/components/pages/flights/FlightListSection/FlightListSection';
import { useSession } from '@/hooks/useSession';

const Flights: NextPage = () => {
	useSession({ redirectTo: '/login' });

	return (
		<MainLayout>
			<FlightListSection />
		</MainLayout>
	);
};

export default Flights;
