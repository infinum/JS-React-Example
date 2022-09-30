const CORE_DOMAIN = 'core';
const SHARED_DOMAIN = 'shared';
const FEATURE_DOMAIN = 'feature';
const rootDomains = [CORE_DOMAIN, SHARED_DOMAIN, FEATURE_DOMAIN];

/**
 * @param {import("plop").NodePlopAPI} plop
 * @param {{ base?: string }} config
 */
module.exports = function projectStructure(plop, config) {
	const base = config?.base || './src';

	plop.setGenerator('component', {
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
				name: 'coreType',
				message: (answer) => `Enter ${answer.rootDomain} component type:`,
				default: 'single-part',
				choices: ['single-part', 'multi-part'],
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

			const { rootDomain, componentName } = answers;

			actions.push({
				type: 'addMany',
				destination: `${base}/components/{{rootDomain}}/{{pascalCase name}}`,
				templateFiles: 'templates/component/{{rootDomain}}/{{coreType}}/**',
				base: 'templates/component/{{rootDomain}}/{{coreType}}',
				data: { componentName },
				abortOnFail: true,
			});

			if (rootDomain === CORE_DOMAIN) {
				actions.push({
					type: 'add',
					destination: `${base}/styles/theme/components/test.ts`,
					template: 'templates/theme/core/single-part/theme.hbs',
				});
			}

			return actions;
		},
	});
};
