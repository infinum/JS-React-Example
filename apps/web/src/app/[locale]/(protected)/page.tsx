import { getServerSession } from '@/lib/auth';
import { ExampleComponent } from '@infinum/ui/components/example';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { LocaleSwitcher } from '../../_components/LocaleSwitcher/LocaleSwitcher';
import { ThemeToggle } from '../../_components/ThemeToggle/ThemeToggle';

const HomePage = async () => {
	const t = await getTranslations('example.ExamplePage');
	const session = await getServerSession();

	return (
		<div className="flex h-screen flex-col items-center justify-center space-y-4">
			<div className="flex flex-col">
				<Image src="/assets/images/logo.png" alt="Infinum logo" width={180} height={38} priority />
				<ExampleComponent className="text-center" text={`Welcome to ${process.env.NEXT_PUBLIC_WEB_APP_NAME}`} />
				<h1>{t('title')}</h1>
				<Link href="/">{t('about')}</Link>
				<LocaleSwitcher />
				<ThemeToggle />
				<p className="rainbow:text-green-500 text-blue-600 dark:text-red-500">Colors depend on current variant</p>
				<div>{session ? 'Logged in' : 'Not logged in'}</div>
			</div>
		</div>
	);
};

export const dynamic = 'force-dynamic';

export default HomePage;
