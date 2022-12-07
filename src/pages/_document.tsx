import { getSafeLocale } from '@/utils/locale';
import { DocumentProps, Head, Html, Main, NextScript } from 'next/document';

const AppDocument = (props: DocumentProps) => {
	const currentLocale = getSafeLocale(props.__NEXT_DATA__.locale);

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
