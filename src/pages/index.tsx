import { ReactElement } from 'react';

import { MainLayout } from '@layouts/MainLayout/MainLayout';
import { Seo } from '@organisms/Seo/Seo';
import { ProductSection } from '@organisms/ProductSection/ProductSection';
import { HeroSection } from '@organisms/HeroSection/HeroSection';
import { ShowcaseSection } from '@organisms/ShowcaseSection/ShowcaseSection';
import { ContactSection } from '@organisms/ContactSection/ContantSection';

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
