const CORE_DOMAIN = 'core';
const SHARED_DOMAIN = 'shared';
const FEATURE_DOMAIN = 'feature';
const rootDomains = [CORE_DOMAIN, SHARED_DOMAIN, FEATURE_DOMAIN];

const { componentTypes } = require('../constants');

/**
 * @param {{ base?: string }} config
 * @returns {import("plop").GeneratorConfig}
 */
module.exports = function component(config) {
	const base = config?.base || './src';

	return {
		description: 'Generates a Chakra UI component',
		prompts: [
			{
				type: 'list',
				name: 'rootDomain',
				message: 'Select a root domain:',
				default: CORE_DOMAIN,
				choices: rootDomains,
			},
			{
				when: ({ rootDomain }) => rootDomain === FEATURE_DOMAIN,
				type: 'input',
				name: 'featureDomain',
				message: 'Enter feature component domain (e.g. todos):',
			},
			{
				when: ({ rootDomain }) => rootDomain === CORE_DOMAIN,
				type: 'list',
				name: 'componentType',
				message: (answer) => `Enter ${answer.rootDomain} component type:`,
				default: componentTypes[0],
				choices: componentTypes,
			},
			{
				type: 'input',
				name: 'name',
				message: 'Enter component name (e.g. MyComponent):',
			},
		],
		actions(answers) {
			const actions = [];

			if (!answers) return actions;

			const { rootDomain, name } = answers;

			actions.push({
				type: 'addMany',
				destination: `${base}/components/{{rootDomain}}/{{pascalCase name}}`,
				templateFiles: 'templates/component/{{rootDomain}}/{{componentType}}/**',
				base: 'templates/component/{{rootDomain}}/{{componentType}}',
				data: { name },
				abortOnFail: true,
			});

			if (rootDomain === CORE_DOMAIN) {
				actions.push({
					type: 'add',
					path: `${base}/styles/theme/components/{{dashCase name}}.ts`,
					templateFile: 'templates/theme/components/{{componentType}}.hbs',
				});

				actions.push({
					type: 'modify',
					path: `${base}/styles/theme/index.ts`,
					pattern: /\/\/ -- PLOP:IMPORT_COMPONENT_THEME --/gi,
					template: `import \{ {{camelCase name}}Theme as {{pascalCase name}} \} from './components/{{dashCase name}}';\n// -- PLOP:IMPORT_COMPONENT_THEME --`,
					data: { name },
				});

				actions.push({
					type: 'modify',
					path: `${base}/styles/theme/index.ts`,
					pattern: /\/\/ -- PLOP:REGISTER_COMPONENT_THEME --/gi,
					template: `{{pascalCase name}},\n		// -- PLOP:REGISTER_COMPONENT_THEME --`,
					data: { name },
				});
			}

			return actions;
		},
	};
};
