import { axe } from 'jest-axe';
import { act } from 'react-dom/test-utils';
import { render } from 'test-utils';
import { MainFooter } from './MainFooter';

describe('MainFooter', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<MainFooter />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should be accessible', async () => {
		const { container } = render(<MainFooter />);

		await act(async () => {
			const results = await axe(container);

			expect(results).toHaveNoViolations();
		});
	});
});
