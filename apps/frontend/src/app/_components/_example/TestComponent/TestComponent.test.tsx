import { render } from '@/tests/utils';
import { TestComponent } from './TestComponent';

describe('TestComponent', () => {
	it('should render title', () => {
		const { getByText } = render(<TestComponent />);

		expect(getByText('example.ExamplePage.title')).toBeInTheDocument();
	});
});
