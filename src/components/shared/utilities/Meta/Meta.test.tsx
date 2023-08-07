import { ReactNode } from 'react';
import { render } from 'test-utils';
import { Meta } from './Meta';

jest.mock('next/head', () => {
	return {
		__esModule: true,
		default: ({ children }: { children: ReactNode }) => {
			return <>{children}</>;
		},
	};
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@chakra-ui/react', () => ({
	...jest.requireActual('@chakra-ui/react'),
	ChakraProvider: ({ children }: { children: ReactNode }) => {
		return <>{children}</>;
	},
}));

describe('Meta', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<Meta />, {
			container: document.head,
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it('should match snapshot with custom title and description', () => {
		const { asFragment } = render(<Meta title="Custom title" description="Custom description" />, {
			container: document.head,
		});

		expect(asFragment()).toMatchSnapshot('custom-title-and-description');
	});
});
