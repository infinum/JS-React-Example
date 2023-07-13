import { Global } from '@emotion/react';
import { render } from 'test-utils';
import { GlobalStyles } from './GlobalStyles';

jest.mock('@emotion/react', () => ({
	...jest.requireActual('@emotion/react'),
	Global: jest.fn(),
}));

describe('GlobalStyles', () => {
	it('should call Global from emotion', () => {
		render(<GlobalStyles styles={{}} />);

		expect(Global).toBeCalled();
	});
});
