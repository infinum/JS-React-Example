const INIT_COMMAND = 'init';
const ADD_FOUNDATION_COMMAND = 'add-foundation';
const ADD_COMPONENT_COMMAND = 'add-component';
const commands = [INIT_COMMAND, ADD_FOUNDATION_COMMAND, ADD_COMPONENT_COMMAND];

const foundations = ['colors'];

const { componentTypes } = require('../constants');

/**
 * @param {{ base?: string }} config
 * @returns {import("plop").GeneratorConfig}
 */
module.exports = function theme(config) {
	const base = config?.base || './src';

	return {
		description: 'Generate a Chakra UI theme',
		prompts: [
			{
				type: 'list',
				name: 'command',
				message: 'Select a command:',
				default: commands,
				choices: commands,
			},
			{
				when: ({ command }) => command === ADD_FOUNDATION_COMMAND,
				type: 'list',
				name: 'foundation',
				message: 'Select foundation:',
				default: foundations[0],
				choices: foundations,
			},
			{
				when: ({ command }) => command === ADD_COMPONENT_COMMAND,
				type: 'input',
				name: 'name',
				message: 'Enter component name:',
			},
			{
				when: ({ command }) => command === ADD_COMPONENT_COMMAND,
				type: 'list',
				name: 'componentType',
				message: 'Select a component type:',
				default: componentTypes[0],
				choices: componentTypes,
			},
		],
		actions(answers) {
			const actions = [];

			if (!answers) return actions;

			const { command, name } = answers;

			if (command === INIT_COMMAND) {
				actions.push({
					type: 'add',
					path: `${base}/styles/theme/index.ts`,
					templateFile: 'templates/theme/init/theme.hbs',
				});
			}

			if (command === ADD_FOUNDATION_COMMAND) {
				actions.push({
					type: 'add',
					path: `${base}/styles/theme/foundations/{{dashCase foundation}}.ts`,
					templateFile: 'templates/theme/foundations/{{dashCase foundation}}.hbs',
				});

				actions.push({
					type: 'modify',
					path: `${base}/styles/theme/index.ts`,
					pattern: /\/\/ -- PLOP:IMPORT_FOUNDATION_THEME --/gi,
					template: `import {{pascalCase name}} from './foundation/{{dashCase name}}';\n// -- PLOP:IMPORT_FOUNDATION_THEME --`,
					data: { name },
				});

				actions.push({
					type: 'modify',
					path: `${base}/styles/theme/index.ts`,
					pattern: /\/\/ -- PLOP:REGISTER_FOUNDATION_THEME --/gi,
					template: `{{pascalCase name}},\n		// -- PLOP:REGISTER_FOUNDATION_THEME --`,
					data: { name },
				});
			}

			if (command === ADD_COMPONENT_COMMAND) {
				actions.push({
					type: 'add',
					path: `${base}/styles/theme/components/{{dashCase name}}.ts`,
					templateFile: 'templates/theme/components/{{componentType}}.hbs',
					data: { name },
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
