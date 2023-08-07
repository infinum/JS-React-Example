import { TextareaField } from '@/components/shared/fields/TextareaField/TextareaField';
import { axe } from 'jest-axe';
import { render, screen } from 'test-utils';

const testLabel = 'Test Label';
const testName = 'Test Name';
const testErrorMessage = 'Test Error Message';

const TestTextareaField = ({ label = testLabel, name = testName, errors = {} }) => {
	return <TextareaField label={label} name={name} errors={errors} />;
};

describe('TextareaField', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<TestTextareaField />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should be accessible', async () => {
		const { container } = render(<TestTextareaField />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});

	it('should be accessible when invalid', async () => {
		const errors = { [testName]: { message: testErrorMessage } };

		const { container } = render(<TestTextareaField errors={errors} />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});

	it('should display error message when invalid', () => {
		const testErrorMessage = 'Test Error Message';
		const errors = { [testName]: { message: testErrorMessage } };

		render(<TestTextareaField errors={errors} />);

		expect(screen.getByText(testErrorMessage)).toBeInTheDocument();
	});

	it('should render correct label', () => {
		render(<TestTextareaField />);

		expect(screen.getByText(testLabel)).toBeInTheDocument();
	});

	it('should render correct name', () => {
		render(<TestTextareaField />);

		const textareaField = screen.getByLabelText(testLabel);

		expect(textareaField).toHaveAttribute('name', testName);
	});
});
