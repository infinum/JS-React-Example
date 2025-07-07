import { useTranslations } from 'next-intl';

export const TestComponent = () => {
	const t = useTranslations('example.ExamplePage');

	return <div>{t('title')}</div>;
};
