import { ReactElement } from 'react';

import { MainLayout } from '@layouts/MainLayout/MainLayout';
import { Seo } from '@ui/organisms/Seo/Seo';
import { ProductSection } from '@ui/organisms/ProductSection/ProductSection';
import { HeroSection } from '@ui/organisms/HeroSection/HeroSection';
import { ShowcaseSection } from '@ui/organisms/ShowcaseSection/ShowcaseSection';
import { ContactSection } from '@ui/organisms/ContactSection/ContantSection';

export default function LandingPage(): ReactElement {
	return (
		<MainLayout>
			<Seo title="Landing Page" description="JS-React-Example landing page" />
			<HeroSection />
			<ProductSection />
			<ShowcaseSection />
			<ContactSection />
		</MainLayout>
	);
}
