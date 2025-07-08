import { renderServer } from '@/tests/utils';
import { TestComponent } from './TestComponent';

describe('TestComponent', () => {
	it('should render title and description', async () => {
		const description = 'some-description';

		const { getByText, getByRole } = await renderServer(TestComponent, { description });

		expect(getByText('example.ExamplePage.title')).toBeInTheDocument();
		expect(getByText(description)).toBeInTheDocument();

		const homeLink = getByRole('link', { name: /example.ExamplePage.about/ });
		expect(homeLink).toHaveAttribute('href', '/about');
	});
});
