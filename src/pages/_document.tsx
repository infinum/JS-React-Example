import { ColorModeScript } from '@chakra-ui/react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import theme from '../styles/theme/index';

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<link rel="preload" href="/fonts/GT-Haptik-Regular.woff" as="font" crossOrigin="" />
					<link rel="preload" href="/fonts/GT-Haptik-Bold.woff" as="font" crossOrigin="" />
				</Head>
				<body>
					<ColorModeScript initialColorMode={theme.config.initialColorMode} />
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
