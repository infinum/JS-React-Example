import { Board } from './Board';
import { render } from 'test-utils';

describe('Board', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<Board />);

		expect(asFragment()).toMatchSnapshot();
	});
});
