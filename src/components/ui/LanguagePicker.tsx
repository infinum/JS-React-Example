import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';

import styled, { ITheme } from 'theming/Theme';

const Select = styled.select`
	padding: ${({ theme }) => theme.spacings.l};
`;

export const LanguagePicker = (): ReactElement => {
	const { t, i18n } = useTranslation();
	const theme = useTheme<ITheme>();

	const handleLanguageChange = (event) => {
		i18n.changeLanguage(event.target.value);
	};

	return (
		<Select
			css={{ backgroundColor: theme.colors.primary }}
			data-testid="language-picker"
			onChange={handleLanguageChange}
		>
			<option data-testid="option1" value="en_US">
				{t('english')}
			</option>
			<option data-testid="option2" value="hr_HR">
				{t('croatian')}
			</option>
		</Select>
	);
};
