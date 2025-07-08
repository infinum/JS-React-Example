import { render, screen } from '@/tests/utils';
import { ExampleServerComponent } from './ExampleServerComponent';

// Mock the env function
jest.mock('@/lib/env', () => ({
	env: jest.fn(),
}));

const mockEnv = require('@/lib/env').env as jest.MockedFunction<typeof import('@/lib/env').env>;

describe('ExampleServerComponent', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the component with both public and private variables', () => {
		mockEnv.mockImplementation((key) => {
			if (key === 'NEXT_PUBLIC_EXAMPLE_VARIABLE') return 'test-public-value';
			if (key === 'PRIVATE_EXAMPLE_VARIABLE') return 'test-private-value';
			return '';
		});

		render(<ExampleServerComponent />);

		expect(screen.getByText('This is a server component')).toBeInTheDocument();
		expect(screen.getByText('Public variable: test-public-value')).toBeInTheDocument();
		expect(screen.getByText('Private variable: test-private-value')).toBeInTheDocument();
	});

	it('calls env function with correct parameters', () => {
		mockEnv.mockImplementation((key) => {
			if (key === 'NEXT_PUBLIC_EXAMPLE_VARIABLE') return 'public-value';
			if (key === 'PRIVATE_EXAMPLE_VARIABLE') return 'private-value';
			return '';
		});

		render(<ExampleServerComponent />);

		expect(mockEnv).toHaveBeenCalledWith('NEXT_PUBLIC_EXAMPLE_VARIABLE');
		expect(mockEnv).toHaveBeenCalledWith('PRIVATE_EXAMPLE_VARIABLE');
		expect(mockEnv).toHaveBeenCalledTimes(2);
	});

	it('handles empty environment variables', () => {
		mockEnv.mockReturnValue('');

		render(<ExampleServerComponent />);

		expect(screen.getByText('This is a server component')).toBeInTheDocument();
		expect(screen.getByText('Public variable:')).toBeInTheDocument();
		expect(screen.getByText('Private variable:')).toBeInTheDocument();
	});
});
