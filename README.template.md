# [TODO:PROJECT_NAME]

[TODO:PROJECT_DESCRIPTION]

- [Setup](#setup)
  - [Prerequisites / Dependencies](#prerequisites--dependencies)
  - [Installation](#installation)
  - [Post-install](#post-install)
- [Usage](#usage)
  - [Running the app](#running-the-app)
  - [Building the app](#building-the-app)
- [Testing](#testing)
  - [Unit testing](#unit-testing)
  - [End to end tests](#end-to-end-tests)
  - [Code quality](#code-quality)
- [Environments](#environments)
- [Environment variables](#environment-variables)
  - [List of environment variables](#list-of-environment-variables)
- [Deployment](#deployment)
- [Releases](#releases)
- [Translations](#translations)
- [Licencing](#licencing)

## Setup

### Prerequisites / Dependencies

You will need to have NodeJS and NPM installed to run this application. It's recommended to use a NodeJS version manager to manage your versions. Required NodeJS versions will typically match LTS (long-term support) versions and you can check which exact version to install by checking `.node-version` file in the repository root.

### Installation

1. clone this repository: `git clone [TODO:GIT_LINK]`
2. install all the dependencies: `npm ci`

### Post-install

1. set up the [environment variables](#environment-variables)

## Usage

### Running the app

To run the app, you can simply run `npm start`. This starts the application in the environment dependent on your environment setup.

### Building the app

To build the app you can use some of the following commands:

```
npm run build
npm run build:dev
npm run build:prod    # builds the app for production

```

## Testing

### Unit testing

To start the unit tests you can use one of the following commands:

```
npm run test
npm run test:watch              # runs all tests in watch mode and without code coverage report
npm run test:watch:coverage     # runs all tests in watch mode with code coverage report

```

### End to end tests

[TODO:DESCRIBE_E2E]

### Code quality

The following tools are used in the project to ensure code quality:

Prettier: for consistent code formatting.
ESLint: for identifying and fixing code quality issues.
Stylelint: for identifying and fixing CSS code quality issues.
Husky: Git hooks to automate code quality checks with ESLint and Prettier

Local code quality checks (Prettier, ESLint, and Stylelint) are run before a user can commit their code through Husky's _pre-commit_ hook, which ensures that the code pushed to Git is consistent and doesn't include any obvious issues that can be detected with static analysis.

## Environments

There are currently two application environments:

1. DEV - development instance, used for testing developed features
   - API: [TODO:DEV_BACKEND_API_URL]
   - Frontend: [TODO:DEV_APP_URL]
2. PRODUCTION - production environment
   - API: [TODO:PROD_BACKEND_API_URL]
   - Frontend: [TODO:PROD_APP_URL]

## Environment variables

You can specify environment variables as per the guide in the [Nuts & Bolts](https://infinum.github.io/ngx-nuts-and-bolts/docs/environment-variables).

### List of environment variables

| Variable         | Requirement | Description                                                |
| ---------------- | ----------- | ---------------------------------------------------------- |
| API_HOST         | required    | API endpoint URL                                           |
| ENV              | required    | Available options: development, production                 |
| ASSETS_BASE_HREF | optional    | Specifies the base path for the static assets (default: /) |

## Deployment

The application deployment is managed with GitHub Actions.

More information on the deployment process can be found in [Deployment process wiki page](TODO:GITHUB_WIKI_PAGE).

## Releases

Releases are handled through GitHub Releases feature and documentation for it can be found on [Release process wiki page](TODO:GITHUB_WIKI_PAGE).

## Translations

The application uses [Polyglot](TODO:PROJECT_POLYGLOT_LINK) for handling translations. More information can be found on the [Translations handling wiki page](TODO:GITHUB_WIKI_PAGE).

## Licencing

The application uses a licence header for all TypeScript files. To help out with setting this up for new files, you can install `licenser` extension.

```
# CMD + P
ext install licenser

```

This extension will add proper license headers to each new file.

You can also add license headers manually:

```
# CMD + SHIFT + P
licenser: Insert license header

```
