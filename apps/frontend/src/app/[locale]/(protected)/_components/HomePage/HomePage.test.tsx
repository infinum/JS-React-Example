import { getServerSession } from '@/lib/auth';
import { render, screen } from '@/tests/utils';
import { getTranslations } from 'next-intl/server';
import { beforeEach, describe, expect, it, vi, type MockedFunction } from 'vitest';
import { HomePage } from './HomePage';

// Mock next-intl server function
vi.mock('next-intl/server', () => ({
	getTranslations: vi.fn(),
}));

// Mock auth
vi.mock('@/lib/auth', () => ({
	getServerSession: vi.fn(),
}));

// Mock Next.js components
vi.mock('next/image', () => ({
	default: ({ alt, src, width, height, priority, ...props }: any) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img alt={alt} src={src} width={width} height={height} data-priority={priority} {...props} />
	),
}));

vi.mock('next/link', () => ({
	default: ({ href, children, ...props }: any) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

// Mock UI components
vi.mock('@infinum/ui/components/example', () => ({
	ExampleComponent: ({ text, className }: any) => (
		<div className={className} data-testid="example-component">
			{text}
		</div>
	),
}));

// Mock app components
vi.mock('@/app/_components/LocaleSwitcher/LocaleSwitcher', () => ({
	LocaleSwitcher: () => <div data-testid="locale-switcher">Locale Switcher</div>,
}));

vi.mock('@/app/_components/ThemeToggle/ThemeToggle', () => ({
	ThemeToggle: () => <button data-testid="theme-toggle">Theme Toggle</button>,
}));

const mockGetTranslations = vi.mocked(getTranslations) as MockedFunction<any>;
const mockGetServerSession = vi.mocked(getServerSession) as MockedFunction<any>;

describe('HomePage', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		// Mock translations - getTranslations returns a function
		mockGetTranslations.mockResolvedValue((key: string) => {
			const translations: Record<string, string> = {
				title: 'Example Page',
				about: 'This is example page.',
			};
			return translations[key] || key;
		});
	});

	it('renders the HomePage with translations when user is logged out', async () => {
		mockGetServerSession.mockResolvedValue(null);

		const HomePageComponent = await HomePage();
		render(HomePageComponent);

		// Check if translated content is rendered
		expect(screen.getByText('Example Page')).toBeInTheDocument();
		expect(screen.getByText('This is example page.')).toBeInTheDocument();

		// Check if other components are rendered
		expect(screen.getByAltText('Infinum logo')).toBeInTheDocument();
		expect(screen.getByTestId('example-component')).toBeInTheDocument();
		expect(screen.getByText('Welcome to Infinum')).toBeInTheDocument();
		expect(screen.getByTestId('locale-switcher')).toBeInTheDocument();
		expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();

		// Check login status
		expect(screen.getByText('Not logged in')).toBeInTheDocument();
	});

	it('renders the HomePage with translations when user is logged in', async () => {
		mockGetServerSession.mockResolvedValue({ user: { id: '1', name: 'Test User' } });

		const HomePageComponent = await HomePage();
		render(HomePageComponent);

		// Check if translated content is rendered
		expect(screen.getByText('Example Page')).toBeInTheDocument();
		expect(screen.getByText('This is example page.')).toBeInTheDocument();

		// Check login status
		expect(screen.getByText('Logged in')).toBeInTheDocument();
	});

	it('calls getTranslations with correct namespace', async () => {
		mockGetServerSession.mockResolvedValue(null);

		await HomePage();

		expect(mockGetTranslations).toHaveBeenCalledWith('example.ExamplePage');
	});

	it('renders the logo with correct attributes', async () => {
		mockGetServerSession.mockResolvedValue(null);

		const HomePageComponent = await HomePage();
		render(HomePageComponent);

		const logo = screen.getByAltText('Infinum logo');
		expect(logo).toHaveAttribute('src', '/assets/images/logo.png');
		expect(logo).toHaveAttribute('width', '360');
		expect(logo).toHaveAttribute('height', '76');
		expect(logo).toHaveAttribute('data-priority', 'true');
	});

	it('renders the ExampleComponent with correct props', async () => {
		mockGetServerSession.mockResolvedValue(null);

		const HomePageComponent = await HomePage();
		render(HomePageComponent);

		const exampleComponent = screen.getByTestId('example-component');
		expect(exampleComponent).toHaveClass('text-center');
		expect(exampleComponent).toHaveTextContent('Welcome to Infinum');
	});
});
