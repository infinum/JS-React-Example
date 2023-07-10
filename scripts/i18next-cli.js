// This is a cjs file
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const fs = require('fs');

// TODO read these form config
const defaultLocale = 'en-US';
const defaultNS = 'common';

const readPath = path.join(__dirname, '..', 'public', 'locales', defaultLocale);
const savePath = path.join(__dirname, '..', 'typings', 'i18next.d.ts');

const getNameData = (name) => {
	const isKebabCase = name.includes('-');
	const importName = isKebabCase ? name.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) : name;
	const safePropName = isKebabCase ? `["${name}"]` : name;

	return { name, importName, safePropName };
};

const generate = (names) => `// NOTE: this file is generated with "npm run i18n:generate" command

import "i18next";

${names
	.map((nameObj) => `import ${nameObj.importName} from 'public/locales/${defaultLocale}/${nameObj.name}.json';`)
	.join('\n')}

declare module 'i18next' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface CustomTypeOptions {
		// custom namespace type if you changed it
		defaultNS: '${defaultNS}';
		// custom resources type
		resources: {
			${names.map((nameObj) => `${nameObj.safePropName}: typeof ${nameObj.importName};`).join('\n\t\t\t')}
		};
	}
}
`;

fs.readdir(readPath, (err, files) => {
	if (err) {
		return console.log(`Unable to scan directory: ${err}`);
	}

	const names = files.map((file) => getNameData(file.replace('.json', '')));
	const template = generate(names);

	fs.writeFile(savePath, template, (err) => {
		if (err) {
			return console.log(`Unable to save: ${err}`);
		}

		console.log('The file was saved!');
	});
});
