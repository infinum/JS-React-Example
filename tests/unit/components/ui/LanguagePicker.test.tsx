import 'jest';
import React from 'react';

import { render, screen, userEvent, t, testYoloHrHrValue, testYoloEnUsValue } from '../../../test-utils';
import { LanguagePicker } from '../../../../src/components/ui/LanguagePicker';

describe('LanguagePicker', () => {
	it('should show options for en and hr locales', () => {
		const locales = [
			{ value: 'en_US', label: t('english') },
			{ value: 'hr_HR', label: t('croatian') },
		];

		render(<LanguagePicker />);

		// getting options by role - preferred if available
		const options = screen.getAllByRole('option');

		expect(options).toHaveLength(2);
		options.forEach((option: HTMLOptionElement, index) => {
			expect(option.value).toEqual(locales[index].value);
			expect(option.textContent).toEqual(locales[index].label);
		});
	});

	it('should have ability to change locale', () => {
		const Component = () => (
			<>
				<span>{t('testYolo')}</span>
				<LanguagePicker />
			</>
		);

		const { rerender } = render(<Component />);

		// getting options by testid
		const option1 = screen.getByTestId('option1') as HTMLOptionElement;
		const option2 = screen.getByTestId('option2') as HTMLOptionElement;
		const translatedText = screen.getByText(t('testYolo'));

		expect(translatedText.textContent).toEqual(testYoloEnUsValue);
		expect(option1.selected).toBe(true);
		expect(option2.selected).toBe(false);

		userEvent.selectOptions(screen.getByTestId('language-picker'), ['hr_HR']);

		rerender(<Component />);

		expect(translatedText.textContent).toEqual(testYoloHrHrValue);
		expect(option1.selected).toBe(false);
		expect(option2.selected).toBe(true);
	});
});
