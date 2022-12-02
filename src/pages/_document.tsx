import { DocumentProps, Head, Html, Main, NextScript } from 'next/document';

import i18nextConfig from '../../next-i18next.config';

const AppDocument = (props: DocumentProps) => {
	const currentLocale = props.__NEXT_DATA__.locale ?? i18nextConfig.i18n.defaultLocale;

	return (
		<Html lang={currentLocale}>
			<Head>
				<meta charSet="utf-8" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default AppDocument;
