import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html>
				<Head>
					<link rel="preload" href="/fonts/GT-Haptik-Regular.ttf" as="font" crossOrigin="true" />
					<link rel="preload" href="/fonts/GT-Haptik-Bold.ttf" as="font" crossOrigin="true" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
