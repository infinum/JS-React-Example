/** @type {import('prettier').Config} */
module.exports = {
	printWidth: 120,
	endOfLine: 'lf',
	useTabs: true,
	tabWidth: 2,
	arrowParens: 'always',
	quoteProps: 'as-needed',
	bracketSpacing: true,
	singleQuote: true,
	semi: true,
	trailingComma: 'es5',
	plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-sh'], // Enables Tailwind classes sorting and shell script formatting
	tailwindFunctions: ['cva', 'cn'], // Enables sorting of Tailwind classes in "cva" and "cn" functions, IntelliSense is configured in ".vscode/settings.json"
};
