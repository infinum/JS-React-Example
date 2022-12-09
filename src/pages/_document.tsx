import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentProps } from 'next/document';

const newrelic = require('newrelic');

type Props = DocumentProps & Awaited<ReturnType<Awaited<typeof getInitialProps>>>;

const AppDocument = ({ browserTimingHeader }: Props) => {
	return (
		<Html>
			<Head>
				<link rel="shortcut icon" href="/favicon.svg" />
				<link href="/manifest.json" rel="manifest" />
				<script type="text/javascript" dangerouslySetInnerHTML={{ __html: browserTimingHeader }} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export async function getInitialProps(ctx: DocumentContext) {
	const initialProps = await Document.getInitialProps(ctx);

	const browserTimingHeader: string = newrelic.getBrowserTimingHeader({
		hasToRemoveScriptWrapper: true,
	});

	return {
		...initialProps,
		browserTimingHeader,
	};
}

export default AppDocument;
