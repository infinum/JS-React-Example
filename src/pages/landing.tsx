import { ReactElement } from 'react';

import { MainLayout } from '@/components/layouts/MainLayout/MainLayout';
import { Seo } from '@/components/ui/organisms/Seo/Seo';
import { ProductSection } from '@/components/ui/organisms/ProductSection/ProductSection';
import { HeroSection } from '@/components/ui/organisms/HeroSection/HeroSection';
import { ShowcaseSection } from '@/components/ui/organisms/ShowcaseSection/ShowcaseSection';
import { ContactSection } from '@/components/ui/organisms/ContactSection/ContantSection';

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
