import { NextPage } from 'next';
import { useTranslation } from 'react-i18next';

const CSRTranslationPage: NextPage = () => {
	const { t, ready } = useTranslation(['main-navigation']);

	if (!ready) return <div>loading translations...</div>;
	// but because of this ready return, you may see a warning like this: "Expected server HTML to contain a matching text node for..."

	return <div>{t('main-navigation:nav.home')}</div>;
};

export default CSRTranslationPage;
