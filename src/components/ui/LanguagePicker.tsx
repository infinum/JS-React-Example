import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguagePicker = (): ReactElement => {
	const { t, i18n } = useTranslation();

	const handleLanguageChange = (event) => {
		i18n.changeLanguage(event.target.value);
	};

	return (
		// eslint-disable-next-line jsx-a11y/no-onchange
		<select data-testid="language-picker" onChange={handleLanguageChange}>
			<option data-testid="option1" value="en_US">
				{t('english')}
			</option>
			<option data-testid="option2" value="hr_HR">
				{t('croatian')}
			</option>
		</select>
	);
};
