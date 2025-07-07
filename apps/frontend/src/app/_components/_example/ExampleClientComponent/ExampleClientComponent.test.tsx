import { render, screen } from '@/tests/utils';
import { ExampleClientComponent } from './ExampleClientComponent';

// Mock the env function
jest.mock('@/lib/env', () => ({
	env: jest.fn(),
}));

const mockEnv = require('@/lib/env').env as jest.MockedFunction<typeof import('@/lib/env').env>;

describe('ExampleClientComponent', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the component with public variable', () => {
		mockEnv.mockReturnValue('test-public-value');

		render(<ExampleClientComponent />);

		expect(screen.getByText('This is a client component')).toBeInTheDocument();
		expect(screen.getByText('Public variable: test-public-value')).toBeInTheDocument();
	});

	it('calls env function with correct parameter', () => {
		mockEnv.mockReturnValue('test-value');

		render(<ExampleClientComponent />);

		expect(mockEnv).toHaveBeenCalledWith('NEXT_PUBLIC_EXAMPLE_VARIABLE');
		expect(mockEnv).toHaveBeenCalledTimes(1);
	});

	it('handles empty public variable', () => {
		mockEnv.mockReturnValue('');

		render(<ExampleClientComponent />);

		expect(screen.getByText('This is a client component')).toBeInTheDocument();
		expect(screen.getByText('Public variable:')).toBeInTheDocument();
	});
});
