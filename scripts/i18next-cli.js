const path = require('path');
const fs = require('fs');

// TODO read these form config
const defaultLocale = 'en-US';
const defaultNS = 'common';

const readPath = path.join(__dirname, '..', 'public', 'locales', defaultLocale);
const savePath = path.join(__dirname, '..', 'typings', 'react-i18next.d.ts');

const generate = (names) => `// NOTE: this file is generated with "npm run i18n:generate" command

import 'react-i18next';
${names.map((name) => `import ${name} from 'public/locales/${defaultLocale}/${name}.json';`).join('\n')}

declare module 'react-i18next' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface CustomTypeOptions {
		// custom namespace type if you changed it
		defaultNS: '${defaultNS}';
		// custom resources type
		resources: {
			${names.map((name) => `${name}: typeof ${name};`).join('\n\t\t\t')}
		};
	}
}
`;

fs.readdir(readPath, (err, files) => {
	if (err) {
		return console.log(`Unable to scan directory: ${err}`);
	}

	const names = files.map((file) => file.replace('.json', ''));
	const template = generate(names);

	fs.writeFile(savePath, template, (err) => {
		if (err) {
			return console.log(`Unable to save: ${err}`);
		}

		console.log('The file was saved!');
	});
});
