/**
 * Use this file to mock theme, store, localisation, ...
 * Based on: https://testing-library.com/docs/react-testing-library/setup
 */
import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'emotion-theming';

import localisation from 'localisation/Localisation';
import { theme } from 'theming/Theme';

export const testYoloEnUsValue = 'You only live once';
export const testYoloHrHrValue = 'Samo jednom se zivi';
localisation.addResource('en_US', 'translations', 'testYolo', testYoloEnUsValue);
localisation.addResource('hr_HR', 'translations', 'testYolo', testYoloHrHrValue);

const wrapper = ({ children }): ReactElement => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

const customRender = (ui: ReactElement, options?: any) => render(ui, { wrapper, ...options });

const customT = (key) => localisation.t(key);

export * from '@testing-library/react';

export { customRender as render, userEvent, customT as t };
