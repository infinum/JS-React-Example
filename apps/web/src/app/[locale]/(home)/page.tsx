import { ExampleComponent } from '@infinum/ui/components/example';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { LocaleSwitcher } from '../../_components/LocaleSwitcher/LocaleSwitcher';
import { ThemeToggle } from '../../_components/ThemeToggle/ThemeToggle';

export default function HomePage() {
	const t = useTranslations('example.ExamplePage');

	return (
		<div className="flex h-screen flex-col items-center justify-center space-y-4">
			<div className="flex flex-col">
				<h1>{t('title')}</h1>
				<Image src="/assets/images/logo.png" alt="Infinum logo" width={180} height={38} priority />
				<ExampleComponent className="text-center" text={`Welcome to ${process.env.NEXT_PUBLIC_WEB_APP_NAME}`} />
				<LocaleSwitcher />
				<ThemeToggle />
				<p className="rainbow:text-green-500 text-blue-600 dark:text-red-500">Colors depend on current variant</p>
			</div>
		</div>
	);
}

export const dynamic = 'force-dynamic';
