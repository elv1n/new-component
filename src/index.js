#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const program = require('commander');

const {
  getConfig,
  buildPrettifier,
  logIntro,
  logItemCompletion,
  logConclusion,
  logError,
} = require('./helpers');
const {
  requireOptional,
  mkDirPromise,
  readFilePromiseRelative,
  writeFilePromise,
} = require('./utils');


// Load our package.json, so that we can pass the version onto `commander`.
const { version } = require('../package.json');

// Get the default config for this component (looks for local/global overrides,
// falls back to sensible defaults).
const config = getConfig();

// Convenience wrapper around Prettier, so that config doesn't have to be
// passed every time.
const prettify = buildPrettifier(config.prettierConfig);

const extraTypes = {
  fn: 'functional',
  fnp: 'functional-with-props'
};

program
  .version(version)
  .arguments('<componentName>')
  .option(
    '-t, --type <componentType>',
    'Type of React component to generate',
    /^(class|pure-class|functional|functional-with-props|fn|fnp)$/i,
    config.type
  ).option(
    '-d, --dir <pathToDirectory>',
    'Path to the component directory (default: current directory)',
    process.cwd()
  ).option(
    '-ts, --typescript',
    'Which file extension to use for the component',
    config.typescript
  ).parse(process.argv);

const [componentName] = program.args;

const type = extraTypes[program.type] || program.type;

const isTS = program.typescript;

const indexExtension = isTS ? 'ts' : 'js';
const componentExtension = isTS ? 'tsx' : 'js';

// Find the path to the selected template file.
const templatePath = isTS ? `./templates-ts/${type}.txt` : `./templates/${type}.txt`;

// Get all of our file paths worked out, for the user's project.
const componentDir = `${program.dir}/${componentName}`;
const filePath = `${componentDir}/${componentName}.${componentExtension}`;
const indexPath = `${componentDir}/index.${indexExtension}`;


logIntro({ name: componentName, dir: componentDir, type });

if (isTS && (type === 'pure-class' || type === 'functional-with-props')) {
  logError(`Sorry, ${type} not available for typescript.`)
  process.exit(0);
}

// Check if componentName is provided
if (!componentName) {
  logError(`Sorry, you need to specify a name for your component like this: nc <name>`)
  process.exit(0);
}


// Our index template is super straightforward, so we'll just inline it for now.
const indexTemplate = prettify(isTS ? `\
export * from './${componentName}';
` : `\
export { ${componentName} } from './${componentName}';
`);

// Check to see if a directory at the given path exists
const fullPathToParentDir = path.resolve(program.dir);
if (!fs.existsSync(fullPathToParentDir)) {
  logError(`Sorry, you need to create a parent "${program.dir}" directory.`)
  process.exit(0);
}

// Check to see if this component has already been created
const fullPathToComponentDir = path.resolve(componentDir);
if (fs.existsSync(fullPathToComponentDir)) {
  logError(`Looks like this component already exists! There's already a component at ${componentDir}.\nPlease delete this directory and try again.`)
  process.exit(0);
}

// Start by creating the directory that our component lives in.
mkDirPromise(componentDir)
  .then(() => {
    return readFilePromiseRelative(templatePath)
  })
  .then(template => {
    logItemCompletion('Directory created.');
    return template;
  })
  .then(template => (
    // Replace our placeholders with real data (so far, just the component name)
    template.replace(/COMPONENT_NAME/g, componentName)
  ))
  .then(template => (
    // Format it using prettier, to ensure style consistency, and write to file.
    writeFilePromise(filePath, template)
  ))
  .then(template => {
    logItemCompletion('Component built and saved to disk.');
    return template;
  })
  .then(template => (
    // We also need the `index.js` file, which allows easy importing.
    writeFilePromise(indexPath, indexTemplate)
  ))
  .then(template => {
    logItemCompletion('Index file built and saved to disk.');
    return template;
  })
  .then(template => {
    logConclusion();
  })
  .catch(err => {
    fs.rmdirSync(componentDir);
    console.error(err);
  })
