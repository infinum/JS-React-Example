import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface TestProps {
	description: string;
}

export const TestComponent = async ({ description }: TestProps) => {
	const t = await getTranslations('example.ExamplePage');

	return (
		<div>
			<p>{t('title')}</p>
			<p>{description}</p>
			<div>
				<Link href="/about">{t('about')}</Link>
			</div>
		</div>
	);
};
