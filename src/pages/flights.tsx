import React from 'react';
import { NextPage } from 'next';

import { MainLayout } from '@/components/shared/layouts/MainLayout/MainLayout';
import { FlightListSection } from '@/components/pages/flights/FlightListSection/FlightListSection';
import { AuthRedirect } from '@/components/shared/utilities/AuthRedirect/AuthRedirect';

const Flights: NextPage = () => {
	return (
		<MainLayout>
			<AuthRedirect to="/login" />

			<FlightListSection />
		</MainLayout>
	);
};

export default Flights;
