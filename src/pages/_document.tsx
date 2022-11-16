import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';

const newrelic = require('newrelic');

const AppDocument = ({ browserTimingHeader }: { browserTimingHeader: string }) => {
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

AppDocument.getInitialProps = async function (
	ctx: DocumentContext
): Promise<DocumentInitialProps & { browserTimingHeader: string }> {
	const initialProps = await Document.getInitialProps(ctx);

	const browserTimingHeader: string = newrelic.getBrowserTimingHeader({
		hasToRemoveScriptWrapper: true,
	});

	return {
		...initialProps,
		browserTimingHeader,
	};
};

export default AppDocument;
