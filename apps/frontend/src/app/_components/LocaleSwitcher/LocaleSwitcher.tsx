import { routing } from '@/lib/i18n/routing';
import { SelectItem } from '@infinum/ui/components/select';
import { Locale, useLocale, useTranslations } from 'next-intl';
import { LocaleSwitcherSelect } from './LocaleSwitcherSelect/LocaleSwitcherSelect';

export const LocaleSwitcher = () => {
	const t = useTranslations('common.components.LocaleSwitcher');
	const locale = useLocale();

	const renderLabel = (code: Locale) => {
		return t.has(`languageNames.${code}`) ? t(`languageNames.${code}`) : t('languageNames.unknown');
	};

	return (
		<LocaleSwitcherSelect defaultValue={locale} label={t('label')}>
			{routing.locales.map((locale) => (
				<SelectItem key={locale} value={locale}>
					{renderLabel(locale)}
				</SelectItem>
			))}
		</LocaleSwitcherSelect>
	);
};
