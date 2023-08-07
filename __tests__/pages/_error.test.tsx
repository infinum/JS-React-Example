import CustomErrorPage, { ICustomErrorPageProps } from '@/pages/_error';
import { render, screen } from 'test-utils';
import NextErrorComponent from 'next/error';
import { axe } from 'jest-axe';
import { NextPageContext } from 'next';
import Bugsnag from '@bugsnag/js';

jest.mock('@bugsnag/js', () => ({ notify: jest.fn() }));

describe('CustomErrorPage', () => {
	it('should be accessible', async () => {
		const context = {} as NextPageContext;

		const props = (await NextErrorComponent.getInitialProps(context)) as ICustomErrorPageProps;

		const { container } = render(<CustomErrorPage {...props} />);

		const results = await axe(container);

		expect(results).toHaveNoViolations();
	});

	it('should show heading and subheading', async () => {
		const context = {} as NextPageContext;

		const props = (await NextErrorComponent.getInitialProps(context)) as ICustomErrorPageProps;

		render(<CustomErrorPage {...props} />);

		expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: /Error occurred!/i })).toBeInTheDocument();
		expect(screen.getByRole('img', { name: /presentation/i })).toHaveAttribute(
			'src',
			'/images/infinum-contruction.png'
		);
	});

	it('should notify Bugnsag', () => {
		const props = { statusCode: 404, hasGetInitialPropsRun: false, err: new Error('Does not exist') };

		render(<CustomErrorPage {...props} />);

		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(Bugsnag.notify).toHaveBeenCalled();
	});
});
