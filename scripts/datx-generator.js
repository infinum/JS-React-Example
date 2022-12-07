const path = require('path');
const fs = require('fs');
const glob = require('glob');
const parser = require('@babel/parser');
const babelGenerate = require('@babel/generator').default;

const configFileName = 'datx-generator.config.js';

const parserConfig = {
	sourceType: 'module',
	plugins: ['typescript', 'decorators-legacy'],
};

const { models: modelsGlob, output } = require(`${process.cwd()}/${configFileName}`);

// getType is a function that returns the type of the model based on the source code using babel parser
const getType = (source) => {
	const ast = parser.parse(source, parserConfig);

	const type = ast.program.body.find((node) => node.type === 'ExportNamedDeclaration');

	return type.declaration.body.body.find((node) => node.key.name === 'type').value.value;
};

// getAttributes is a function that returns the attributes of the model based on the source code using babel parser
const getAttributes = (source) => {
	const ast = parser.parse(source, parserConfig);

	// find all props with @Attribute decorator without any options
	const arguments = ast.program.body
		.filter((node) => node.type === 'ExportNamedDeclaration')
		.map((node) => node.declaration.body.body)
		.flat()
		.filter((node) => node.decorators)
		.filter((node) => node.decorators[0].expression.callee.name === 'Attribute')
		.filter((node) => node.decorators[0].expression.arguments.length === 0);

	if (arguments.length === 0) {
		return '';
	}

	return `
	attributes: {
		${arguments
			.map((node) => `${node.key.name}: ${babelGenerate(node.typeAnnotation.typeAnnotation).code};`)
			.join('\n\t\t')}
	};`;
};

// getRelationships is a function that returns the relationships of the model based on the source code using babel parser finding all props with @Attribute decorator with toOne or toMany options
const getRelationships = (source) => {
	const ast = parser.parse(source, parserConfig);

	// find all props with @Attribute decorator with toOne or toMany options
	const arguments = ast.program.body
		.filter((node) => node.type === 'ExportNamedDeclaration')
		.map((node) => node.declaration.body.body)
		.flat()
		.filter((node) => node.decorators)
		.filter((node) => node.decorators[0].expression.callee.name === 'Attribute')
		.filter((node) => node.decorators[0].expression.arguments.length > 0)
		.filter(
			(node) =>
				node.decorators[0].expression.arguments[0]?.properties[0].key.name === 'toOne' ||
				node.decorators[0].expression.arguments[0]?.properties[0].key.name === 'toMany'
		);

	if (arguments.length === 0) {
		return '';
	}

	return `
	relationships: {
		${arguments
			.map(
				(node) => `${node.key.name}: {
			data: ${babelGenerate(node.typeAnnotation.typeAnnotation).code};
		};`
			)
			.join('\n\t\t')}
	};`;
};

const generate = (models) => `// NOTE: this file is generated with datx generator

${models
	.map(
		({ basename, source }) => `export type ${basename} = {
	type: '${getType(source)}';
	id?: string;
	lid?: string;${getAttributes(source)}${getRelationships(source)}
}
`
	)
	.join('\n')}
`;

const models = glob.sync(modelsGlob).map((model) => ({
	basename: path.basename(model, '.ts'),
	source: fs.readFileSync(model, 'utf8'),
}));

const template = generate(models);

if (!fs.existsSync(path.join(process.cwd(), output))) {
	fs.mkdirSync(path.join(process.cwd(), output));
}

fs.writeFile(path.join(process.cwd(), output, 'types.ts'), template, (err) => {
	if (err) {
		return console.log(`Unable to save: ${err}`);
	}

	console.log('The file was saved!');
});
