import { ReactNode } from 'react';
import { render } from 'test-utils';
import { Meta } from './Meta';

jest.mock('next/head', () => {
	return {
		__esModule: true,
		default: ({ children }: { children: ReactNode }) => {
			return <div data-head>{children}</div>;
		},
	};
});

describe('Meta', () => {
	it('should matches snapshot', () => {
		const { asFragment } = render(<Meta />);

		expect(asFragment()).toMatchSnapshot();
	});

	it('should match snapshot with custom title and description', () => {
		const { asFragment } = render(<Meta title="Custom title" description="Custom description" />);

		expect(asFragment()).toMatchSnapshot('custom-title-and-description');
	});
});
