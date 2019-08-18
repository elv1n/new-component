<p align="center">
  <img src="https://github.com/elv1n/new-component/blob/master/docs/logo@2x.png?raw=true" width="285" height="285" alt="new-component logo">
  <br>
  <a href="https://www.npmjs.org/package/@elv1n/new-component"><img src="https://img.shields.io/npm/v/@elv1n/new-component.svg?style=flat" alt="npm"></a>
</p>

# `nc`
### Simple, customizable utility for adding new React components to your project.

<img src="https://github.com/elv1n/new-component/blob/master/docs/divider@2x.png?raw=true" width="888" height="100" role="presentation">

Anyone else sick of writing the same component boilerplate, over and over?

This project is a globally-installable CLI for adding new React components. It's dead simple to use, and requires no configuration, although it's easy to customize it to fit your project's coding style.

<br />

## Features
- Simple CLI interface for adding Component, PureComponent, or Stateless Functional components.
- Uses [Prettier](https://github.com/prettier/prettier) to stylistically match the existing project.
- Offers global config, which can be overridden on a project-by-project basis.
- Colourful terminal output!


<br />

## Quickstart

Install via NPM:

```bash
# Using Yarn:
$ yarn global add @elvin/nc

# or, using NPM
$ npm i -g @elvin/nc

$ nc MyComponent
```

`cd` into your project's directory, and try creating a new component:

<p align="center">
  <img src="https://github.com/elv1n/new-component/blob/master/docs/demo.gif?raw=true" width="888" height="369" alt="demo of CLI functionality">
</p>

Your project will now have a new directory at `src/components/Button`. This directory has two files:

```jsx
// `Button/index.js`
export { Button } from './Button';
```

```jsx
// `Button/Button.js`
import React from 'react';
import PropTypes from 'prop-types';

export const Button = () => {
  return <div />;
}

Button.propTypes = {

};

Button.defaultProps = {

};
```

<br />

## Configuration

Configuration can be done through 3 different ways:

- Creating a global `.new-component-config.json` in your home directory (`~/.new-component-config.json`).
- Creating a local `.new-component-config.json` in your project's root directory.
- Command-line arguments.

The resulting values are merged, with command-line values overwriting local values, and local values overwriting global ones.



<br />

## API Reference

### Type

Control the type of component created:
- `functional` for a stateless functional component.
- `functional-with-props` for a stateless functional component.
- `class` for a traditional Component class (default),
- `pure-class` for a PureComponent class,

Legacy `createClass` components are not supported, although support would be easy to add. Feel free to open an issue (or a PR!).

**Usage:**

Command line: `--type <value>` or `-t <value>`

JSON config: `{ "type": <value> }`
<br />

### Directory

Controls the desired directory for the created component. Defaults to `src/components`

Legacy `createClass` components are not supported, although support would be easy to add. Feel free to open an issue (or a PR!).

**Usage:**

Command line: `--dir <value>` or `-d <value>`

JSON config: `{ "dir": <value> }`
<br />

### File Extension

Controls the file extension for the created components. Can be either `js` (default) or `jsx`.

**Usage:**

Command line: `--extension <value>` or `-x <value>`

JSON config: `{ "extension": <value> }`
<br />

### Prettier Config

Delegate settings to Prettier, so that your new component is formatted as you'd like. Defaults to Prettier defaults.

For a full list of options, see the [Prettier docs](https://github.com/prettier/prettier#options).

**Usage:**

Command line: N/A (Prettier config is only controllable through JSON)

JSON config: `{ "prettierConfig": { "key": "value" } }`
<br />

**Example:**

```js
{
  "prettierConfig": {
    "singleQuote": true,
    "semi": false,
  }
}
```

<br />

## Development

To get started with development:
* Check out this git repo locally, you will need to ensure you have Yarn installed globally.
* In the folder run `yarn install`
* Check that command runs `node ../new-component/src/index.js --help`
* Alternatively you can set up a symlink override by running `npm link` then `nc --help`. Note: this will override any globally installed version of this package.

## Credits

Forked from [joshwcomeau/new-component](https://github.com/joshwcomeau/new-component)